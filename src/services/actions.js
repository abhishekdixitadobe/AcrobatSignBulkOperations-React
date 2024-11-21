/*************************************************************************
 * ADOBE CONFIDENTIAL
 * ___________________
 *
 * Copyright 2024 Adobe
 * All Rights Reserved.
 *
 * NOTICE: All information contained herein is, and remains
 * the property of Adobe and its suppliers, if any. The intellectual
 * and technical concepts contained herein are proprietary to Adobe
 * and its suppliers and are protected by all applicable intellectual
 * property laws, including trade secret and copyright laws.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe.
**************************************************************************/

import { getSignedURL, putObject } from '../utils/aws-client';
import { postPhotoshopAPI } from "../utils/ps-api-client";
import { getUUID } from "../utils/fileUtils";
import { handleError } from '../utils/logging';
import {
    setCurrentCall,
    setCurrentCallResponse,
    updateCurrentCallStatus,
    addCurrentCallToLog
} from '../redux/apis';
import { apiCallEvent, API_EVENT } from '../utils/data';
import createMaskActionJSON from '../services/payloads/createMaskAction.json';
import compositeSingleImage from './payloads/compositeSingleImage.json';

const AWS_WORKING_FOLDER = process.env.REACT_APP_AWS_WORKING_FOLDER;

export class CCAPIActions {
    dispatch = null;
    sdk = null;


    constructor(dispatch) {
        this.dispatch = dispatch;
    }

    async init() {
        //this.sdk = await initSDK();
    }

    recordAPICallData (type, name, status, request='') {
        const call = {
            type: type,
            name: name,
            status: status,
            properties: {
                request: request
            }
        }

        this.dispatch(setCurrentCall(call));
    }

    setAPICallStatus (status) {
        this.dispatch(updateCurrentCallStatus(status));
    }

    setAPICallResponse (response) {
        this.dispatch(setCurrentCallResponse(response))
    }

    commitAPICall() {
        this.dispatch(addCurrentCallToLog());
    }

    async uploadFileToS3 (fileToUpload) {
        try {
            //const awsResource = `${AWS_WORKING_FOLDER}/${fileToUpload.name}`;

            // Upload a file to AWS S3 and record.

            this.recordAPICallData(API_EVENT.aws.upload, API_EVENT.aws.actions.upload, API_EVENT.status.start, `File: ${fileToUpload.name}`);
            //console.log('putting file in ' + AWS_WORKING_FOLDER);
            await putObject(fileToUpload);
            this.setAPICallStatus(API_EVENT.status.done);
            this.setAPICallResponse('200 OK');
            this.commitAPICall();
            // Generate signedURL to AWS s3 resource and record.
            this.recordAPICallData(API_EVENT.aws.upload, API_EVENT.aws.actions.signedURL, API_EVENT.status.start, awsResource);
            const signedURL = await getSignedURL('getObject','${fileToUpload.name}');
            console.log(signedURL)
            this.setAPICallStatus(API_EVENT.status.done);
            this.setAPICallResponse(signedURL);
            this.commitAPICall();

            return signedURL;
        } catch (e) {
            handleError (`AWS: File Upload Error: ${e}`);
        }
    }

    async generateS3OutputUrl(outputFileName) {
        try {
            const awsResource = `${AWS_WORKING_FOLDER}/${outputFileName}`
            this.recordAPICallData(API_EVENT.aws.actions.signedURL, API_EVENT.aws.actions.signedURL,awsResource);
            const outputFileURL = await getSignedURL('putObject', awsResource);
            this.setAPICallStatus(API_EVENT.status.done);
            this.setAPICallResponse(outputFileURL);
            this.commitAPICall();

            return outputFileURL;
        } catch (e) {
            handleError (`AWS: Generate signedURL Error: ${e}`);
        }
    }

    async uploadFileToFirefly (file) {
        try {
            console.log(file)
            this.recordAPICallData(API_EVENT.firefly.upload, API_EVENT.firefly.actions.upload, API_EVENT.status.start, `File: ${file.name}`);
            const assetIds = await fileUpload(file);
            this.setAPICallStatus(API_EVENT.status.done);
            this.setAPICallResponse(assetIds);
            this.commitAPICall();

            console.log(assetIds)

            return assetIds.images[0].id;
        } catch (e) {
            handleError (`Firefly API: Error while uploading file to Firefly: ${e}`);
        }

    }

    async createMaskFromImage(imageFile) {
        try {
            const fileId = getUUID();
            const inputImageURL = await this.uploadFileToS3(imageFile);
            const outputFileURL = await this.generateS3OutputUrl(`${fileId}.png`);

            const input = {
                href: inputImageURL,
                storage: 'external',
            };

            const output = {
            href: outputFileURL,
            storage: 'external',
            type: "image/png"
            };

            const requestPayload = {
                input: input,
                output: output,
                params: createMaskActionJSON
            };

            this.recordAPICallData(API_EVENT.photoshop.createMask, API_EVENT.photoshop.actions.createMask, API_EVENT.status.start, requestPayload);
            //await this.sdk.applyPhotoshopActionsJson(input,output,createMaskActionJSON);

            await postPhotoshopAPI('photoshopActions', requestPayload);
            this.setAPICallStatus(API_EVENT.status.done);
            this.setAPICallResponse('200 OK');
            this.commitAPICall();

            const awsResource = `${AWS_WORKING_FOLDER}/${fileId}.png`;
            this.recordAPICallData(API_EVENT.aws.createSignedURL, API_EVENT.aws.actions.signedURL, API_EVENT.status.start,awsResource);
            const signedURL = await getSignedURL('getObject',awsResource);
            this.setAPICallResponse(signedURL);
            this.setAPICallStatus(API_EVENT.status.done);
            this.commitAPICall();

            return signedURL;

        } catch(e) {
            handleError (`Photoshop API: Error while creating mask from image: ${e}`);
        }
    }

    async composeImagefromPSD (inputPSDImageURL, backgroundImageURL, bannerText) {
        const fileId = getUUID();

        const input = {
            href: inputPSDImageURL,
            storage: 'external',
        };

        const output = {
            href: await getSignedURL('putObject', `wip/${fileId}.png`),
            storage: 'external',
            type: "image/png",
            overwrite: true
        };

        const params = compositeSingleImage;
        params.layers[0].input.href = backgroundImageURL;
        params.layers[1].text.content = bannerText;

        console.log(params)

        this.recordAPICallData(API_EVENT.photoshop.editDocument, API_EVENT.photoshop.actions.composeImage, API_EVENT.status.start, params);
        await this.sdk.modifyDocument(input, output, params);
        const imageURL = await getSignedURL('getObject', `wip/${fileId}.png`);
        console.log('final: ' + imageURL);
        this.setAPICallStatus(API_EVENT.status.done);
        this.setAPICallResponse(imageURL);
        this.commitAPICall();

        return imageURL;
    }

    async generativeFill(prompt, imageFile, maskFile) {

        try {
            const imageFileId = await this.uploadFileToFirefly(imageFile);
            const maskFileId = await this.uploadFileToFirefly(maskFile);

            const body = {
                "prompt": prompt,
                "n": 2,
                "seeds":[
                    getRandomSeedValue(),
                    getRandomSeedValue()
                ],
                "size": {
                "width": 1792,
                "height": 1024
                },
                "image": {
                    "id": imageFileId
                },
                "mask":{
                    "id": maskFileId
                }
              };

            this.recordAPICallData(API_EVENT.firefly.genFill, API_EVENT.firefly.actions.genFill, API_EVENT.status.start, body);
            const result = await httpRequest('/v1/images/fill', body, 'reference');
            this.setAPICallStatus(API_EVENT.status.end);
            this.setAPICallResponse(result);
            this.commitAPICall();


            if(result.images) {
                return result.images;
            }

            if(result.error_code) {
                throw new Error(`Error while generating image: ${result.message}`);
            }

        } catch (e) {
            handleError (`Firefly API: Error calling Generative Fill: ${e}`);
        }
    }
}
