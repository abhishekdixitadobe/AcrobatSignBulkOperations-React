/* ************************************************************************
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
import React from 'react';
import { getSignedURL, putObject } from '../utils/aws-client';
import { createMask, generativeFill } from './api-client';
import { fileUpload } from '../utils/firefly-api-client';
import { addLogEntry } from '../redux/app';
import { useDispatch } from 'react-redux';

const EVENT_TYPE = {
    aws: {
        upload:'AWS_FILE_UPLOAD',
        createSignedURL: 'AWS_SIGNED_URL',
    },
    photoshop: {
        createMask: 'PS_CREATE_MASK',
    },
    firefly: {
        upload: 'FF_FILE_UPLOAD',
        genFill: 'FF_GENERATIVE_FILL'
    },
    status: {
        start: 'START',
        processing: 'PROCESSING',
        done: 'DONE'
    }
}



const createWorkflowEvent = (type, name, status, payload) => {
    const dispatch = useDispatch();
    const event = {
        type: type,
        name: name,
        status: status
    };
    dispatch(addLogEntry(event));
}



export const visualizeProduct = async (productImage, template, copy) => {
    //Upload file to AWS
    createWorkflowEvent(EVENT_TYPE.aws.upload, 'Uploading product image...', EVENT_TYPE.status.start);
    //await putObject('wip',productImage);
    createWorkflowEvent(EVENT_TYPE.aws.upload, 'Product image uploaded', EVENT_TYPE.status.done);

    createWorkflowEvent(EVENT_TYPE.aws.createSignedURL, 'Generating SignedURL for product image ...', EVENT_TYPE.status.start);
    //const productImageURL = await getSignedURL('getObject',`wip/${productImage.name}`);
    const productImageURL = 'PRODUCT IMAGE URL PLACEHOLDER';
    createWorkflowEvent(
        EVENT_TYPE.aws.createSignedURL,
        `SignedURL for product image ${productImageURL}`,
        EVENT_TYPE.status.done,
        productImageURL);

    createWorkflowEvent(
        EVENT_TYPE.photoshop.createMask,
        'Calling Photoshop createMask API...',
        EVENT_TYPE.status.start);
    //const result = await createMask(productImageURL);
    const result = 'IMAGE MASK URL PLACEHOLDER';
    createWorkflowEvent(
        EVENT_TYPE.photoshop.createMask,
        `Mask created successfully: ${result}`,
        EVENT_TYPE.status.done);


    createWorkflowEvent(
        EVENT_TYPE.firefly.upload,
        `Uploading mask to Firefly...`,
        EVENT_TYPE.status.start);

    
    const mask = await fetch(result);
    const blob = await mask.blob();

    const file = new File([blob], 'mask.png', {type: 'image/png'});
    const maskId = await fileUpload(file);
    const productId = await fileUpload(productImage);

    const maskId = 'PRODUCT ID PLACEHOLDER';
    createWorkflowEvent(
        EVENT_TYPE.firefly.upload,
        `Mask uploaded to Firefly with id ${maskId}`,
        EVENT_TYPE.status.done);

    createWorkflowEvent(
        EVENT_TYPE.firefly.upload,
        `Up0loading product image to Firefly ...`,
        EVENT_TYPE.status.start);

    const productId = 'PRODUCT ID PLACEHOLDER';
    createWorkflowEvent(
        EVENT_TYPE.firefly.upload,
        `Mask uploaded to Firefly with id ${productId}`,
        EVENT_TYPE.status.done);

    createWorkflowEvent(
        EVENT_TYPE.firefly.genFill,
        `Calling Firefly GenerativeFill API ...`,
        EVENT_TYPE.status.start);
    //const images = await generativeFill('Sun setting behind the CN Tower in Toronto', productId, maskId);
    const images = 'FIREFLY IMAGE URLS'
    createWorkflowEvent(
        EVENT_TYPE.firefly.genFill,
        `Generative Fill call completed.`,
        EVENT_TYPE.status.done,
        images);
}
