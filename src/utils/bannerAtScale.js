import { postAPICall } from "./ps-api-client";
import { readCSV } from "./csvHelper";
import { documentOperation } from "./documentOperation";
import { ffTextToImage } from "./firefly-api-client";
import Logger from "./logger";
import { getInputPresignedURL } from "./presignURL";
import { showLayers } from "./ps-api-client";
import store from "../redux/store";

const PSDMimeTypes = [
  "image/vnd.adobe.photoshop",
  "image/x-photoshop",
  "image/psd",
  "application/photoshop",
  "application/psd",
  "zz-application/zz-winassoc-psd",
  "application/octet-stream",
];

// Main function to process the banner at scale
async function bannerAtScale(updatedImageFiles) {
  console.log("Inside /api/bannerAtScale--");
  const logger = new Logger(store.dispatch);
  // clear previous logs before starting new operation
  logger.clear();
  logger.log("info", "Starting Banner Operation");
  try {
    let psdTemplateName = "";
    let fireFlyAIO = process.env.AIO_FIREFLY_ACTION;
    const fireFlyParam = {
      operation: "upload",
    };

    let fireFlyCreds = await postAPICall(fireFlyAIO, fireFlyParam);
    const processImageFiles = updatedImageFiles
      .filter((file) => file.type === "image/png" || file.type === "image/jpeg")
      .map((file) => processImageFile(file, logger));

    const processCsvFiles = updatedImageFiles
      .filter((file) => file.type === "text/csv")
      .map((file) => processCsvFile(file, logger));

    const processPsdFiles = updatedImageFiles
      .filter((file) => PSDMimeTypes.includes(file.type) || file.name.endsWith('.psd'))
      .map((file) => {
        psdTemplateName = file;
        return processPsdFile(file, logger);
      });

    const [uploadImageResult, csvResults, layerInfo] = await Promise.all([
      Promise.all(processImageFiles),
      Promise.all(processCsvFiles),
      Promise.all(processPsdFiles),
    ]);

    let downloadURLs = await Promise.all(
      // there should only be 1 csv file
      csvResults[0].map(async (csvResult) => {
        let downloadURL = await documentOperation(
          csvResult,
          layerInfo[0], // there should only be 1 psd file
          uploadImageResult,
          psdTemplateName,
          logger,
          fireFlyCreds
        );
        console.log("final downloadURL::", downloadURL.url);
        return downloadURL.url;
      })
    );
    return downloadURLs;
  } catch (e) {
    console.error(e);
  }
}

// Process the image file
async function processImageFile(file, logger) {
  console.log(`Processing foreground file: ${file.name}`);
  logger.log("info", `Processing image file: ${file.name}`);
  const bucketName = process.env.BUCKET_NAME;
  const fileKey = `${file.name}-${Date.now()}`;
  const inputPresignedUrl = await getInputPresignedURL(file, fileKey, logger);
  return { fileKey, inputPresignedUrl };
}

// Process the CSV file
async function processCsvFile(file, logger) {
  let csvData = [];
  logger.log(`Processing CSV file: ${file.name}`);

  try {
    const dataRows = await readCSV(file);
    
    // Extract header to find prompt column and all headline columns
    const header = dataRows[0];
    const promptColumn = Object.keys(header).find(key => key.startsWith("prompt")); // Only one prompt column
    const headlineColumns = Object.keys(header).filter(key => key.startsWith("headline"));
    
    const promises = dataRows.map(async (data) => {
      const { fileName } = data;

      // Collect all headline texts into a single array
      const headlines = headlineColumns.map(headlineCol => data[headlineCol]).filter(Boolean);
      
      // Get the prompt from the single prompt column
      const prompt = data[promptColumn];

      // Generate presigned URL for the prompt
      const presignedUrl = await ffTextToImage(prompt, logger);
      
      return { fileName, headlines, prompt, presignedUrl };
    });
    
    csvData = await Promise.all(promises);
    
  } catch (error) {
    console.error(error);
  }
  
  logger.log("info", "Processed CSV file");
  return csvData;
}



// Process the PSD file
async function processPsdFile(file, logger) {
  console.log(`Processing PSD file: ${file.name}`);
  logger.log("info", `Processing PSD file: ${file.name}`);
  let layerInfo = await showLayers(file, logger);
  return layerInfo;
}

export { bannerAtScale };
