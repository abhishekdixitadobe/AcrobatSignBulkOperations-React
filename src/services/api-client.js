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

import { getSignedURL } from '../utils/aws-client';
import { getUUID } from "../utils/fileUtils";
import {httpRequest,getRandomSeedValue} from '../utils/firefly-api-client'
import createMaskActionJSON from './payloads/createMaskAction.json';
import compositeSingleImage from './payloads/compositeSingleImage.json';

export const createMask = async (inputImageURL, useAction = true) => {
    const sdk = '';
    if(inputImageURL === null ) {
        console.log('Input file must be provided');
    } else {
        try {
            const fileId = getUUID();
            const outputFileURL = await getSignedURL('putObject', `output/${fileId}.png`);
            const input = {
                href: inputImageURL,
                storage: 'external',
              }
              const output = {
                href: outputFileURL,
                storage: 'external',
                type: psApiLib.MimeType.PNG
              }
            if(useAction === false) {
                await sdk.createMask(input, output);
            } else {
                await sdk.applyPhotoshopActionsJson(input,output,createMaskActionJSON);
            }

            const imageURL = await getSignedURL('getObject', `output/${fileId}.png`);
            return imageURL;
        } catch (e) {
            console.log(e);
        }
    }
}

export const compositPSDWithTemplate = async (inputPSDImageURL, inputFireflyImageURL, bannerText) => {
    try{

        const sdk = await initSDK();
        const fileId = getUUID();
        const input = {
            href: inputPSDImageURL,
            storage: 'external',
        };

        const output = {
        href: await getSignedURL('putObject', `wip/${fileId}.png`),
        storage: 'external',
        type: psApiLib.MimeType.PNG,
        overwrite: true
        }

        const params = compositeSingleImage;
        params.layers[0].input.href = inputFireflyImageURL;
        params.layers[1].text.content = bannerText;

        await sdk.modifyDocument(input, output, params);
        const imageURL = await getSignedURL('getObject', `wip/${fileId}.png`);
        return imageURL;
    } catch (e) {
        console.log(e);
    }
}


/**
 * Global convenience function used to upload transient assets to Firefly backend.
 * @param {File} file to upload
 * @returns {Array} An array of image references.
 */
export const uploadToFirefly = async (file) => {;
    const payload = await httpRequest('/v2/storage/image',file, 'file');
    const assetId = payload.images[0].id;
    return assetId;
}

export const generativeFill = async (prompt, imageId, maskId) => {
    if(imageId === null || maskId === null || prompt === null) {
        displayError('You must provide a reference image, a mask and prompt!');
    } else {
        try {
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
                    "id": imageId
                },
                "mask":{
                    "id": maskId
                }
              };

            const result = await httpRequest('/v1/images/fill', body, 'reference');
            if(result.images) {
                return result.images;
            }

            if(result.error_code) {
                console.log(`Error while generating image: ${result.message}`);
            }


        } catch (e) {
            console.log(`Error while generating image: ${e}`);
        }
    }
}
