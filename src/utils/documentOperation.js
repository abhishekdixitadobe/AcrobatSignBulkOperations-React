import { postAPICall, putAPICall } from "./ps-api-client";
import {
  maskforFireFly,
  ffGenerativeFill,
  fireFlyUploadImage,
} from "./firefly-api-client";
import Resizer from "react-image-file-resizer";
import axios from "axios";
import { Buffer } from "buffer";

// Helper function to create a layer object
const createLayer = (name, id, href, type, bounds, content, characterStyles) => ({
  name,
  id,
  locked: false,
  edit: {},
  adjustments: {
    brightnessContrast: {
      brightness: 0,
      contrast: 0,
    },
  },
  type,
  ...(content && { text: { content, characterStyles: characterStyles } }),
  ...(href && { input: { storage: "external", href }}),
  ...(bounds && { bounds }),
});

// Helper function to process a smart object
const processSmartObject = async (
  smartObject,
  csvResult,
  logger,
  fireFlyCreds
) => {
  let href = csvResult.presignedUrl;

  if (smartObject.name.includes("foreground")) {
    href = csvResult.foregroundPresignedURL;
  } else if (
    smartObject.name.includes("background") &&
    smartObject.bounds.width < smartObject.bounds.height
  ) {
    const resizedImageUrl = await resizeImage(
      csvResult.presignedUrl,
      smartObject.bounds
    );
    const maskDownloadURL = await maskforFireFly(
      resizedImageUrl,
      `${csvResult.prompt}-resized-${Date.now()}.jpg`
    );
    const fireFlyUploadImageURL =
      process.env.FIREFLY_BASE_URL + "/v2/storage/image";
    const executeActionUrlRes = await getImageData(maskDownloadURL[1]);
    const ffImageMaskUploadResponse = await fireFlyUploadImage(
      fireFlyUploadImageURL,
      executeActionUrlRes,
      fireFlyCreds,
      logger
    );
    const fireflyMaskId = ffImageMaskUploadResponse.images[0].id;
    const ffImageResizeUploadResponse = await fireFlyUploadImage(
      fireFlyUploadImageURL,
      resizedImageUrl,
      fireFlyCreds,
      logger
    );
    const fireflyResizeId = ffImageResizeUploadResponse.images[0].id;
    href = await ffGenerativeFill(
      csvResult.prompt,
      fireflyResizeId,
      fireflyMaskId,
      logger
    );
  }

  return createLayer(
    smartObject.name,
    smartObject.id,
    href,
    smartObject.type,
    smartObject.bounds
  );
};

// Helper function to resize an image
const resizeImage = async (presignedUrl, bounds) => {
  // Download the image from the presigned URL
  const imageBuffer = await getImageData(presignedUrl);
	console.log("inside resizeImage");
  // Convert the image buffer to a Data URL
  const dataUrl = `data:image/jpeg;base64,${imageBuffer.toString("base64")}`;
  function dataURLToBlob(dataUrl) {
    const arr = dataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  const blob = dataURLToBlob(dataUrl);
  return new Promise((resolve, reject) => {
	  
    Resizer.imageFileResizer(
      blob,
      bounds.width,
      bounds.height,
      "JPEG",
      100,
      0,
      (uri) => {
        // The resized image is returned as a Data URL. If you need it as a buffer,
        // you can convert it like this:
        const base64 = uri.split(",")[1];
        const resizedImageBuffer = Buffer.from(base64, "base64");
        resolve(resizedImageBuffer);
      },
    );
  });
};

// Helper function to fetch an image from a URL
const getImageData = async (presignedUrl) => {
  try {
    const response = await axios.get(presignedUrl, {
      responseType: "arraybuffer", // Get the response as a buffer
    });

    if (response.status !== 200) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }

    const imageBuffer = Buffer.from(response.data, "binary");
    return imageBuffer;
  } catch (error) {
    console.error(error);
  }
};

// Main function
async function documentOperation(
  csvResult,
  layerInfo,
  uploadImageResult,
  psdTemplateName,
  logger,
  fireFlyCreds
) {

  // Find the upload image result that matches the CSV file
  const matchingUploadImage = uploadImageResult.find((uploadImage) =>
    uploadImage.fileKey.includes(csvResult.fileName)
  );
  // Set the foreground presigned URL
  if (matchingUploadImage) {
    csvResult.foregroundPresignedURL = matchingUploadImage.inputPresignedUrl;
  }

  const layers = [];
  for (const layer of layerInfo) {
    if (!layer.children) continue;

    for (const child of layer.children) {
      // Process text layers
      if (child.type === "textLayer") {
        // Find the matching headline based on child.name
        const matchingHeadline = csvResult.headlines.find((headline, index) => 
          child.name.toLowerCase().includes(`headline${index + 1}`)
        )
        layers.push(
          createLayer(
            matchingHeadline,
            parseInt(child.id),
            null,
            "textLayer",
            null,
            matchingHeadline,
            child.text.characterStyles
          )
        );
      } else if (
        // Process smart objects and exclude buttons and dryp layers
        child.type === "smartObject" &&
        !["button", "dryp", "Vector Smart Object"].some((str) =>
          child.name.includes(str)
        )
      ) {
        layers.push(
          await processSmartObject(child, csvResult, logger, fireFlyCreds)
        );
      }
    }
  }

  // could modularize this part with the presignURL.js. Leaving it alone for now. I'm too sleep deprive to mess with it.
  const fileKey = `${psdTemplateName.name}-${Date.now()}`;
  const storageURL = process.env.AIO_STORAGE_ACTION;
  const inputPostURL = await postAPICall(storageURL, {
    fileName: fileKey,
    operation: "putObject",
  });
  const fileBuffer = await new Response(psdTemplateName).arrayBuffer();
  await putAPICall(inputPostURL.url, fileBuffer);
  const inputPresignedUrl = await postAPICall(storageURL, {
    fileName: fileKey,
    operation: "getObject",
  });

  const psdRequestBody = {
    inputs: [
      {
        href: inputPresignedUrl.url,
        storage: "external",
      },
    ],
    options: { layers },
    outputs: [
      {
        href: inputPostURL.url,
        storage: "external",
        type: "image/jpeg",
      },
    ],
  };

  try {
    const documentOperationRes = await postAPICall(
      process.env.AIO_POSTPHOTOSHOP_ACTION,
      {
        requestBody: JSON.stringify(psdRequestBody),
        operation: "documentOperations",
      }
    );
    return await postAPICall(storageURL, {
      fileName: fileKey,
      operation: "getObject",
    });
  } catch (e) {
    console.error(e);
  }
}

export { documentOperation };
