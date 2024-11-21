import Logger from "../utils/logger";
import {
  removeBackground,
  createMask,
  productCrop,
  photoshopActions,
  autoTone,
} from "./ps-api-client";
import store from "../redux/store";

export const bulkOperations = async (operation, updatedImageFiles) => {
  console.log("Inside /api/bulkOperation--");
  const logger = new Logger(store.dispatch);

  logger.clear();
  logger.log("info", "Starting Bulk Operation");

  try {
    console.log("operation::", operation);

    let downloadURL = "";
    let actionFile = "";

    if (operation === "photoshopActions") {
      for (const file of updatedImageFiles) {
        if (file.originalname.endsWith(".atn")) {
          actionFile = file;
        }
      }
    }
    const aioPhotoshopEndpoint = process.env.AIO_POSTPHOTOSHOP_ACTION;

    console.log("updatedImageFiles::", updatedImageFiles);
    const processFiles = updatedImageFiles
      .filter((file) => file.type === "image/png" || file.type === "image/jpeg")
      .map(async (file) => {
        logger.log("info", `Processing file: ${file.name}`);
        switch (operation) {
          case "removeBackground":
            downloadURL = await removeBackground(
              file,
              logger,
              aioPhotoshopEndpoint
            );
            break;
          case "createMask":
            downloadURL = await createMask(file, logger, aioPhotoshopEndpoint);
            break;
          case "productCrop":
            downloadURL = await productCrop(file, logger, aioPhotoshopEndpoint);
            break;
          case "photoshopActions":
            console.log("operation::", operation);
            downloadURL = await photoshopActions(
              file,
              actionFile,
              logger,
              aioPhotoshopEndpoint
            );
            break;
          case "autoTone":
            console.log("operation::", operation);
            downloadURL = await autoTone(file, logger, aioPhotoshopEndpoint);
            break;
          default:
            console.log("Invalid operation");
            break;
        }
        logger.log("info", `End Processing file: ${file.name}`);
        console.log("downloadURL::In Bulk Op::", downloadURL);
        return downloadURL;
      });

    const responseData = await Promise.all(processFiles);
    logger.log("info", "End Bulk Operation");

    return responseData;
  } catch (e) {
    console.error(e);
  }
};
