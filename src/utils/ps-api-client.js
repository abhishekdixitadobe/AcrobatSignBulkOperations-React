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
import {
  getInputPresignedURL,
  getOutputPresignedURL,
  getDownLoadPresignedURL,
} from "./presignURL";
import axios from "axios";
import { bulkOperationsData } from "./bulkOperationsData";

export const postPhotoshopAPI = async (opName, requestBody) => {
  try {
    let url = opName;
    console.log("requestBody-------", requestBody);
    let options = {
      method: "POST",
      body: JSON.stringify(requestBody),
    };

    const response = await fetch("/api/photoshopActions", options);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch data: ${response.status} ${response.statusText}`
      );
    }
    return await response.json();
  } catch (error) {
    console.error("Error in postPhotoshopAPI:", error);
    throw error;
  }
};
/*
export const initSDK = async () => {
    try {
        const { description, version } = require('../../package.json');
        const userAgentHeader = `${description}/${version}`;
        const token = await generateIMSToken();

        const client = await psAPIClient.init(IMS_ORG_ID,CLIENT_ID,token, undefined,{
            'User-Agent': userAgentHeader
        });

        return client;

    } catch (e) {
        console.log(e);
    }


}*/

export const postAPICall = async (endpoint, requestBody) => {
  console.log("postAPICall:::", requestBody);
  try {
    const response = await axios.post(endpoint, requestBody);
    return response.data;
  } catch (error) {
    throw error.response.data || error.message;
  }
};

export const putAPICall = async (endpoint, requestBody) => {
  console.log("putAPICall:::", requestBody);
  try {
    const response = await axios.put(endpoint, requestBody, {
      headers: { "Content-Type": "application/octet-stream" },
    });
    return response.data;
  } catch (error) {
    throw error.response.data || error.message;
  }
};

export const processAction = async (
  operation,
  file,
  logger,
  aioPhotoshopEndpoint,
  actionFile
) => {
  console.log(`Processing ${operation} on file: ${file.name}`);
  const fileKey = `${file.name}-${Date.now()}`;
  const inputPresignedUrl = await getInputPresignedURL(file, fileKey, logger);
  const outputPresignedUrl = await getOutputPresignedURL(fileKey, logger);

  let optionPresignedUrl = null;
  if (operation === "photoshopActions") {
    optionPresignedUrl = await getInputPresignedURL(
      actionFile,
      actionFile.originalname,
      logger
    );
  }

  let psdRequestBody = bulkOperationsData(
    operation,
    inputPresignedUrl,
    outputPresignedUrl,
    optionPresignedUrl,
    actionFile
  );

  const psdRequestBodyString = JSON.stringify(psdRequestBody);

  const requestParam = {
    requestBody: psdRequestBodyString,
    operation: operation === "createMask" ? "maskforFireFly" : operation,
  };

  let actton = await postAPICall(aioPhotoshopEndpoint, requestParam);

  const downloadURL = await getDownLoadPresignedURL(fileKey, logger);
  return downloadURL;
};

export const removeBackground = async (file, logger, aioPhotoshopEndpoint) => {
  return processAction("removeBackground", file, logger, aioPhotoshopEndpoint);
};

export const createMask = async (file, logger, aioPhotoshopEndpoint) => {
  return processAction("createMask", file, logger, aioPhotoshopEndpoint);
};

export const productCrop = async (file, logger, aioPhotoshopEndpoint) => {
  return processAction("productCrop", file, logger, aioPhotoshopEndpoint);
};

export const photoshopActions = async (
  file,
  actionFile,
  logger,
  aioPhotoshopEndpoint
) => {
  return processAction(
    "photoshopActions",
    file,
    logger,
    aioPhotoshopEndpoint,
    actionFile
  );
};

export const autoTone = async (file, logger, aioPhotoshopEndpoint) => {
  return processAction("autoTone", file, logger, aioPhotoshopEndpoint);
};

export const showLayers = async (file, logger) => {
  let url = process.env.AIO_POSTPHOTOSHOP_ACTION;
  let storageURL = process.env.AIO_STORAGE_ACTION;

  const fileKey = file.name;
  console.log("fileKey::", fileKey);
  const urlParams = {
    fileName: fileKey,
    operation: "putObject",
  };
  let inputPostURL = await postAPICall(storageURL, urlParams);
  console.log("inputPostURL::", inputPostURL);
  let uploadURL = await putAPICall(inputPostURL.url, file);
  console.log("uploadURL::", uploadURL);
  const outputParams = {
    fileName: fileKey,
    operation: "getObject",
  };
  let inputPresignedUrl = await postAPICall(storageURL, outputParams);
  //let outputPresignedUrl = inputPostURL;
  console.log("inputPresignedUrl::", inputPresignedUrl.url);
  let requestBody = {
    inputs: [
      {
        href: inputPresignedUrl.url,
        storage: "external",
      },
    ],
    options: {
      thumbnails: {
        type: "image/jpeg",
      },
    },
  };
  const psdRequestStr = JSON.stringify(requestBody);
  console.log("psdRequestStr::", psdRequestStr);
  const postPhotoShopParam = {
    requestBody: psdRequestStr,
    operation: "showLayers",
  };

  let layerInfo = await postAPICall(url, postPhotoShopParam);
  console.log("layerInfo::::", layerInfo);
  return layerInfo.statusRes.outputs[0].layers;
};
