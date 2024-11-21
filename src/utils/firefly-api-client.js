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
import { postAPICall, putAPICall } from "./ps-api-client";
import axios from "axios";

async function ffTextToImage(prompt, logger) {
  try {
    let fireflyTextURL = process.env.FIREFLY_BASE_URL + "/v3/images/generate";
    let url = process.env.AIO_FIREFLY_ACTION;

    console.log("ffTextToImage::url:::", url);
    let ffTextToImageReq = {
      n: 1,
      seeds: [23442],
      prompt: prompt,
      size: {
        width: 2048,
        height: 2048,
      },
    };
    const psdRequestStr = JSON.stringify(ffTextToImageReq);
    console.log("ffTextToImageReq::", psdRequestStr);
    const fireFlyParam = {
      url: fireflyTextURL,
      requestBody: psdRequestStr,
    };

    let response = await postAPICall(url, fireFlyParam);
    console.log("fireFly response::::", response);
    //let response = //await callFireFlyApi(url, ffTextToImageReq, fireFlyCreds);
    return response.fireflyResponse.outputs[0].image.url;
  } catch (e) {
    console.error(e);
  }
}

async function ffGenerativeFill(prompt, binImage, maskID, logger) {
  try {
    let fireflyGenFillURL = process.env.FIREFLY_BASE_URL + "/v1/images/fill";
    let url = process.env.AIO_FIREFLY_ACTION;
    //  console.log("ffGenerativeFill::url:::",url);
    let ffGenerativeFillReq = {
      prompt: prompt,
      n: 2,
      seeds: [23442, 783432],
      size: {
        width: 1024,
        height: 1024,
      },
      image: {
        id: binImage,
      },
      mask: {
        id: maskID,
      },
    };
    const psdRequestStr = JSON.stringify(ffGenerativeFillReq);
    console.log("fireflyGenFillReq::", psdRequestStr);
    const fireFlyParam = {
      url: fireflyGenFillURL,
      requestBody: psdRequestStr,
    };

    let response = await postAPICall(url, fireFlyParam);
    console.log("fireFly response::::", response);
    //let response = //await callFireFlyApi(url, ffTextToImageReq, fireFlyCreds);
    return response.fireflyResponse.images[0].image.presignedUrl;
  } catch (e) {
    console.error(e);
  }
}

async function fireFlyUploadImage(
  endpoint,
  requestBody,
  fireFlyCreds,
  logger,
  retryCount = 0
) {
  const apiKey = process.env.FIREFLY_API_KEY;
  let options = {
    method: "post",
    url: endpoint,
    headers: {
      Authorization: `Bearer ${fireFlyCreds.fireflyResponse.access_token}`,
      "x-api-key": apiKey,
      "Content-Type": "image/jpeg",
    },
    data: requestBody,
  };

  try {
    const response = await axios(options);
    if (response.status === 200) {
      logger.log("info", {
        Action: "Uploaded Image to FireFly API",
        Method: "POST",
        URL: options.url,
        Request: options,
        Response: response.data,
        Status: response.status,
      });
      return response.data;
    }
  } catch (error) {
    if (error.response && error.response.status === 429 && retryCount < 10) {
      const retryAfter = error.response.headers["retry-after"] || 3;
      logger.log(
        "info",
        `API Throttle Limit: Retrying FireFly API call after ${retryAfter} second(s)`
      );
      await new Promise((r) => setTimeout(r, retryAfter * 1000));
      return fireFlyUploadImage(
        endpoint,
        requestBody,
        fireFlyCreds,
        logger,
        retryCount + 1
      );
    } else {
      console.error(error);
    }
  }
}

async function maskforFireFly(resizedImageUrl, resizedFileKey, logger) {
  let url = process.env.AIO_POSTPHOTOSHOP_ACTION;
  let storageURL = process.env.AIO_STORAGE_ACTION;
  let maskArray = [];
  const resizedUrlParams = {
    fileName: resizedFileKey,
    operation: "putObject",
  };
  let inputPostURL = await postAPICall(storageURL, resizedUrlParams);
  console.log("inputPostURL::", inputPostURL);
  let uploadURL = await putAPICall(inputPostURL.url, resizedImageUrl);

  const inputParams = {
    fileName: resizedFileKey,
    operation: "getObject",
  };
  let resizedInputPresignedUrl = await postAPICall(storageURL, inputParams);

  const resizedOutputParams = {
    fileName: resizedFileKey,
    operation: "putObject",
  };
  let resizedOutputPresignedUrl = await postAPICall(
    storageURL,
    resizedOutputParams
  );

  let maskRequestBody = {
    input: {
      href: resizedInputPresignedUrl.url,
      storage: "external",
    },
    output: {
      href: resizedOutputPresignedUrl.url,
      storage: "external",
      mask: {
        format: "soft",
      },
    },
  };
  const maskRequestBodyStr = JSON.stringify(maskRequestBody);
  console.log("maskRequestBodyStr::", maskRequestBodyStr);
  const maskPhotoShopParam = {
    requestBody: maskRequestBodyStr,
    operation: "maskforFireFly",
  };

  let maskInfo = await postAPICall(url, maskPhotoShopParam);
  console.log("maskInfo::::", maskInfo);
  const maskDownloadParams = {
    fileName: resizedFileKey,
    operation: "getObject",
  };
  let maskDownloadURL = await postAPICall(storageURL, maskDownloadParams);
  maskArray.push(resizedOutputPresignedUrl.url);
  maskArray.push(maskDownloadURL.url);
  return maskArray;
}

export { ffTextToImage, ffGenerativeFill, fireFlyUploadImage, maskforFireFly };
