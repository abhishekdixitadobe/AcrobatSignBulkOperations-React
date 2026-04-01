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

export const apiCallEvent = {
    type: '',
    name: '',
    status: '',
    properties: {
        request:'',
        response:''
    }
};

export const API_EVENT = {
    aws: {
        upload:'AWS_FILE_UPLOAD',
        createSignedURL: 'AWS_SIGNED_URL',
        actions: {
            upload: 'Uploading file to AWS S3 bucket.',
            signedURL: 'Generating AWS S3 signedURL to resource.'
        }
    },
    photoshop: {
        createMask: 'PS_CREATE_MASK',
        editDocument: 'EDIT_DOCUMENT',
        actions: {
            createMask: 'Creating mask from an asset using ActionJSON',
            composeImage: 'Calling Photoshop API to compose the image'
        }
    },
    firefly: {
        upload: 'FF_FILE_UPLOAD',
        genFill: 'FF_GENERATIVE_FILL',
        actions: {
            upload:'Uploading file to Firefly storage.',
            genFill: 'Calling Firefly Generative Fill API'
        }
    },
    status: {
        start: 'START',
        processing: 'PROCESSING',
        preview: 'PREVIEW',
        done: 'DONE',
        complete: 'COMPLETE'
    }
}

export const audienceArray = [
    {id: 'millenial-return', name:'Millenial - Return Customer'},
    {id: 'millenial-new', name:'Millenial - New Customer'}
];

export const regionArray = [
    {id: 'canada', name:'Canada'},
    {id: 'germany', name:'Germany'},
    {id: 'france', name:'France'},
];

export const productArray = [
    {id: 'new', name:'New Product'},
    {id: 'dryp', name:'Dryp'},
];

export const getName = (array, id) => {
    const node = array.find((item) => {
         return item.id === id;
     });
     return node.name;
 };

 export const getObjectsFromArray = (sourceArray, listOfIds) => {
    const result = [];
    listOfIds.map(id => {
        const object = sourceArray.find((item) => {
            return item.id === id;
        });
        result.push(object);
    });
    return result;
    
 }

 export const buildList = (sourceArray, array) => {
     let resultString = '';
     array.map(item => {
         resultString += `${getName(sourceArray, item)} and `
     });
     return resultString.substring(0, resultString.length - 5); 
 };