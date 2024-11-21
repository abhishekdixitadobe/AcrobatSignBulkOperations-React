import { postAPICall, putAPICall } from "./ps-api-client";
import Resizer from 'react-image-file-resizer';

export const getInputPresignedURL = async (file, fileKey, logger) => {
  console.log("Inside getInputPresignedURL::");
  let storageURL = process.env.AIO_STORAGE_ACTION;

  const inPutParams = {
    fileName: fileKey,
    operation: "putObject",
  };
  let inputPostURL = await postAPICall(storageURL, inPutParams);

  const fileBuffer = await new Response(file).arrayBuffer();

  let uploadURL = await putAPICall(inputPostURL.url, fileBuffer);

  const inputGetParams = {
    fileName: fileKey,
    operation: "getObject",
  };
  let inputPresignedUrl = await postAPICall(storageURL, inputGetParams);

  

  //BEGIN:: Remove background//

    const psdRequestBody = {
      input:{
          href: inputPresignedUrl.url,
          storage: "external",
        },
      options: {
        "optimize": "performance",
        "process": {
          "postprocess": true
        },
        "service": {
          "version": "4.0"
        }
      },
      output:{
          href: inputPostURL.url,
          storage: "external",
          "overwrite": true,
          "color": {
            "space": "rgb"
          },
          "mask": {
            "format": "soft"
          }
        },
    };

    try {
      const removeBackgroundRes = await postAPICall(
        process.env.AIO_POSTPHOTOSHOP_ACTION,
        {
          requestBody: JSON.stringify(psdRequestBody),
          operation: "removeBackground",
        }
      );
    } catch (e) {
      console.error(e);
    }

  // END:: Remove background//

  return inputPresignedUrl.url;
  // Download the image from the presigned URL
  /*const imageResponse = await fetch(inputPresignedUrl.url);
  const imageBlob = await imageResponse.blob();

  // Resize the image using a different approach
  const resizedImageBlob = await resizeImage(imageBlob, 100, 100); // Resize to width=100, height=100
  console.log('Resized image blob:', resizedImageBlob);
  const resizedImage = new Image();
  resizedImage.src = URL.createObjectURL(resizedImageBlob);
  await new Promise((resolve) => {
    resizedImage.onload = () => resolve();
  });
  const resizedWidth = resizedImage.width;
  const resizedHeight = resizedImage.height;
  console.log('Resized image dimensions:', resizedWidth, 'x', resizedHeight);*/
  

  // Upload the resized image or do further processing as needed
};

// Helper function to resize an image
const resizeImage = async (imageBlob, width, height) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(resolve, 'image/jpeg');
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(imageBlob);
  });
};





export const getOutputPresignedURL = async (fileKey, logger) => {
  let storageURL = process.env.AIO_STORAGE_ACTION;

  const outputParams = {
    fileName: fileKey,
    operation: "putObject",
  };
  const outputPresignedUrl = await postAPICall(storageURL, outputParams);
  return outputPresignedUrl.url;
};

export const getDownLoadPresignedURL = async (fileKey, logger) => {
  let storageURL = process.env.AIO_STORAGE_ACTION;

  const downloadParams = {
    fileName: fileKey,
    operation: "getObject",
  };
  const downloadUrl = await postAPICall(storageURL, downloadParams);
  // console.log("downloadUrl::", downloadUrl.url);
  return downloadUrl.url;
};
