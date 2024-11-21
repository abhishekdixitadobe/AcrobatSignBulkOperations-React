export const bulkOperationsData = (
  operation,
  inputPresignedUrl,
  outputPresignedUrl,
  optionPresignedUrl,
  actionFile
) => {
  let requestBody = {};

  switch (operation) {
    case "removeBackground":
    case "createMask":
      requestBody = {
        input: {
          href: inputPresignedUrl,
          storage: "external",
        },
        output: {
          href: outputPresignedUrl,
          storage: "external",
          mask: {
            format: "soft",
          },
        },
      };
      break;
    case "productCrop":
      requestBody = {
        inputs: [
          {
            href: inputPresignedUrl,
            storage: "external",
          },
        ],
        options: {
          unit: "Pixels",
          width: 0,
          height: 0,
        },
        outputs: [
          {
            href: outputPresignedUrl,
            storage: "external",
            type: "image/png",
            mask: {
              format: "soft",
            },
          },
        ],
      };
      break;
    case "photoshopActions":
      requestBody = {
        inputs: [
          {
            href: inputPresignedUrl,
            storage: "external",
          },
        ],
        options: {
          actions: [
            {
              href: optionPresignedUrl,
              storage: "external",
              actionName: actionFile.originalname,
            },
          ],
        },
        outputs: [
          {
            href: outputPresignedUrl,
            storage: "external",
            type: "image/png",
            mask: {
              format: "soft",
            },
          },
        ],
      };
      break;
    case "autoTone":
      requestBody = {
        inputs: {
          href: inputPresignedUrl,
          storage: "external",
        },
        outputs: [
          {
            href: outputPresignedUrl,
            storage: "external",
            type: "image/png",
            overwrite: true,
            quality: 12,
          },
        ],
      };
      break;
    default:
      break;
  }

  return requestBody;
};
