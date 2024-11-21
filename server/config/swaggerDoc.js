module.exports = {
  "/api/listObjects": {
    post: {
      summary:
        "Returns some or all (up to 1,000) of the objects in a bucket with each request.",
      description:
        "Returns some or all (up to 1,000) of the objects in a bucket with each request.",
      parameters: [
        {
          in: "query",
          name: "path",
          schema: {
            type: "string",
          },
          required: true,
          description: "The path to fetch objects from",
        },
      ],
      responses: {
        200: {
          description: "Photoshop Actions executed successfully.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  result: {
                    type: "string",
                    description: "The result of the Photoshop action.",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  "/api/uploadObject": {
    post: {
      summary: "Uploads a file to the AWS S3",
      description: "Uploads a file to the AWS S3 using multipart/form-data",
      consumes: ["multipart/form-data"],
      parameters: [
        {
          in: "formData",
          name: "image",
          type: "file",
          description: "The file to upload",
          required: true,
        },
      ],
      responses: {
        200: {
          description: "File uploaded successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    description: "Confirmation message",
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Bad request, file upload failed",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    description: "Error message",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  "/api/signedURL": {
    post: {
      summary: "Generates a signed URL from AWS S3.",
      description:
        "Generates a signed URL that allows performing a specified operation on an object within a specified period",
      parameters: [
        {
          in: "body",
          name: "body",
          description: "Request body containing input, output, and params",
          required: true,
          schema: {
            type: "object",
            properties: {
              operation: {
                type: "string",
                description:
                  "The operation to be performed (e.g., 'getObject', 'putObject')",
              },
              path: {
                type: "string",
                description: "The path to the object",
              },
            },
          },
        },
      ],
      responses: {
        200: {
          description: "Successful operation",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  signedURL: {
                    type: "string",
                    description: "The signed URL",
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Invalid request",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    description: "Error message",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  "/api/photoshopActions": {
    post: {
      summary: "Executes Photoshop Actions on a given image",
      description:
        "Executes Photoshop Actions on a given image with the specified inputs and options",
      parameters: [
        {
          in: "body",
          name: "body",
          description: "Request body containing input, output, and params",
          required: true,
          schema: {
            type: "object",
            properties: {
              input: {
                type: "object",
                properties: {
                  href: {
                    type: "string",
                    description: "URL of the input image",
                  },
                  storage: {
                    type: "string",
                    enum: ["external", "azure", "dropbox", "adobe", "cclib"],
                    description: "Storage type of the input image",
                  },
                },
              },
              output: {
                type: "object",
                properties: {
                  href: {
                    type: "string",
                    description: "URL of the output image",
                  },
                  storage: {
                    type: "string",
                    enum: ["external", "azure", "dropbox", "adobe", "cclib"],
                    description: "Storage type of the output image",
                  },
                  type: {
                    type: "string",
                    description: "Type of the output image (e.g., image/png)",
                  },
                },
              },
              options: {
                type: "object",
                description: "Parameters for the Photoshop Actions",
              },
            },
          },
        },
      ],
      responses: {
        200: {
          description: "Successful operation",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  result: {
                    type: "string",
                    description: "The result of the Photoshop Actions",
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Invalid request",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    description: "Error message",
                  },
                },
              },
            },
          },
        },
      },
    },
  },

  "/api/documentOperation": {
    post: {
      summary: "Apply psd edits.",
      description: "Apply psd edits.",
      parameters: [
        {
          in: "body",
          name: "body",
          description: "Request body containing input, output, and params",
          required: true,
          schema: {
            type: "object",
            properties: {
              input: {
                type: "object",
                properties: {
                  href: {
                    type: "string",
                    description: "URL of the input image",
                  },
                  storage: {
                    type: "string",
                    enum: ["external", "azure", "dropbox", "adobe", "cclib"],
                    description: "Storage type of the input image",
                  },
                },
              },
              output: {
                type: "object",
                properties: {
                  href: {
                    type: "string",
                    description: "URL of the output image",
                  },
                  storage: {
                    type: "string",
                    enum: ["external", "azure", "dropbox", "adobe", "cclib"],
                    description: "Storage type of the output image",
                  },
                  type: {
                    type: "string",
                    description: "Type of the output image (e.g., image/png)",
                  },
                },
              },
              options: {
                type: "object",
                description: "Parameters for the Photoshop Actions",
              },
            },
          },
        },
      ],
      responses: {
        200: {
          description: "Successful operation",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  result: {
                    type: "string",
                    description: "URL of the processed image",
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Invalid request",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    description: "Error message",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  "/api/documentManifest": {
    post: {
      summary:
        "Get information about the PSD document, including metadata about the file as a whole as well as detailed information about the layers included in the file.",
      description:
        "Get information about the PSD document, including metadata about the file as a whole as well as detailed information about the layers included in the file.",
      parameters: [
        {
          in: "body",
          name: "body",
          description: "Request body containing input, output, and params",
          required: true,
          schema: {
            type: "object",
            properties: {
              input: {
                type: "object",
                required: true,
                properties: {
                  href: {
                    type: "string",
                    description: "URL of the input image",
                  },
                  storage: {
                    type: "string",
                    enum: ["external"],
                    description: "Storage type of the input image",
                  },
                },
              },
              options: {
                type: "object",
                description: "Parameters for the Photoshop Actions",
                properties: {
                  thumbnails: {
                    type: "object",
                    description: "Parameters for the thumbnails",
                    properties: {
                      type: {
                        type: "string",
                        enum: ["image/jpeg", "image/png", "image/tiff"],
                        description: "Desired thumbnail format",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      ],
      responses: {
        200: {
          description: "Successful operation",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  result: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        outputs: {
                          type: "string",
                          description:
                            "Array of objects as outputs from Photoshop API",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Invalid request",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    description: "Error message",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  "/api/removeBackground": {
    post: {
      summary:
        "Generates a PNG file in 4 channel RGBA format with the cutout operation applied to the input image.",
      description:
        "Generates a PNG file in 3 channel RGB format with the mask operation applied to the input image.",
      parameters: [
        {
          in: "body",
          name: "body",
          description: "Request body containing input, output, and params",
          required: true,
          schema: {
            type: "object",
            properties: {
              input: {
                type: "object",
                required: true,
                properties: {
                  href: {
                    type: "string",
                    description: "URL of the input image",
                  },
                  storage: {
                    type: "string",
                    enum: ["external"],
                    description: "Storage type of the input image",
                  },
                },
              },
              options: {
                type: "object",
                description: "Parameters for the Photoshop Actions",
                properties: {
                  thumbnails: {
                    type: "object",
                    description: "Parameters for the thumbnails",
                    properties: {
                      type: {
                        type: "string",
                        enum: ["image/jpeg", "image/png", "image/tiff"],
                        description: "Desired thumbnail format",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      ],
      responses: {
        200: {
          description: "Successful operation",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  result: {
                    type: "string",
                    description: "The result of the Photoshop Actions",
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Invalid request",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    description: "Error message",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  "/api/mask": {
    post: {
      summary: "Generates a mask PNG.",
      description: "Generates a mask PNG.",
      parameters: [
        {
          in: "body",
          name: "body",
          description: "Request body containing input, output, and params",
          required: true,
          schema: {
            type: "object",
            properties: {
              input: {
                type: "object",
                required: true,
                properties: {
                  href: {
                    type: "string",
                    description: "URL of the input image",
                  },
                  storage: {
                    type: "string",
                    enum: ["external"],
                    description: "Storage type of the input image",
                  },
                },
              },
              output: {
                type: "object",
                properties: {
                  href: {
                    type: "string",
                    description: "URL of the output image",
                  },
                  storage: {
                    type: "string",
                    enum: ["external", "azure", "dropbox", "adobe", "cclib"],
                    description: "Storage type of the output image",
                  },
                  type: {
                    type: "string",
                    description: "Type of the output image (e.g., image/png)",
                  },
                },
              },
              options: {
                type: "object",
                properties: {
                  optimize: {
                    type: "string",
                    enum: ["performance", "batch"],
                    description: "Optimization level for the mask generation",
                  },
                  process: {
                    type: "object",
                    properties: {
                      postprocess: {
                        type: "boolean",
                        description:
                          "Whether to apply post-processing to the mask",
                      },
                    },
                  },
                  service: {
                    type: "object",
                    properties: {
                      version: {
                        type: "string",
                        description: "Version of the Photoshop service",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      ],
      responses: {
        200: {
          description: "Successful operation",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  result: {
                    type: "string",
                    description: "The result of the Photoshop Actions",
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Invalid request",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    description: "Error message",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  "/api/productCrop": {
    post: {
      summary: "Executes Product Crop on a given image.",
      description: "Executes Product Crop on a given image.",
      parameters: [
        {
          in: "body",
          name: "body",
          description: "Request body containing input, output, and params",
          required: true,
          schema: {
            type: "object",
            properties: {
              input: {
                type: "object",
                required: true,
                properties: {
                  href: {
                    type: "string",
                    description: "URL of the input image",
                  },
                  storage: {
                    type: "string",
                    enum: ["external"],
                    description: "Storage type of the input image",
                  },
                },
              },
              output: {
                type: "object",
                properties: {
                  href: {
                    type: "string",
                    description: "URL of the output image",
                  },
                  storage: {
                    type: "string",
                    enum: ["external", "azure", "dropbox", "adobe", "cclib"],
                    description: "Storage type of the output image",
                  },
                  type: {
                    type: "string",
                    description: "Type of the output image (e.g., image/png)",
                  },
                },
              },
              options: {
                type: "object",
                properties: {
                  unit: {
                    type: "string",
                    enum: ["performance", "batch"],
                    description: "Optimization level for the mask generation",
                  },
                  width: {
                    type: "number",
                  },
                  height: {
                    type: "number",
                  },
                },
              },
            },
          },
        },
      ],
      responses: {
        200: {
          description: "Successful operation",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  result: {
                    type: "string",
                    description: "The result of the Photoshop Actions",
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Invalid request",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    description: "Error message",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  "/api/fireFlyGenExpand": {
    post: {
      summary: "Expand an image using FireFly",
      description:
        "Expand the provided image using FireFly with the given prompt",
      consumes: ["multipart/form-data"],
      parameters: [
        {
          name: "prompt",
          in: "formData",
          description: "The prompt for the image expansion",
          required: true,
          type: "string",
        },
        {
          name: "updatedImagec",
          in: "formData",
          description: "The image file to be expanded",
          required: true,
          type: "file",
        },
      ],
      responses: {
        200: {
          description: "Successful operation",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  result: {
                    type: "string",
                    description:
                      "The result of the FireFly image expansion process",
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Invalid request",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    description: "Error message",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  "/api/fireFlyTexttoImage": {
    post: {
      summary: "Convert text to an image using FireFly",
      description: "Convert the provided text to an image using FireFly",
      parameters: [
        {
          name: "prompt",
          in: "body",
          description: "The prompt for the image generation",
          required: true,
          schema: {
            type: "string",
          },
        },
      ],
      responses: {
        200: {
          description: "Successful operation",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  result: {
                    type: "string",
                    description:
                      "The result of the FireFly text-to-image conversion process",
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Invalid request",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    description: "Error message",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  "/api/fireFlyGenFill": {
    post: {
      summary: "Generate and fill an image using FireFly",
      description:
        "Generate and fill an image using FireFly with the provided image file",
      consumes: ["multipart/form-data"],
      parameters: [
        {
          in: "formData",
          name: "image",
          type: "file",
          description: "The image file to be processed",
          required: true,
        },
      ],
      responses: {
        200: {
          description: "Successful operation",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  result: {
                    type: "string",
                    description:
                      "The result of the FireFly generation and filling process",
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Invalid request",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    description: "Error message",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  "/api/completions": {
    post: {
      summary: "Generate completions for a given text input",
      description:
        "Generate completions for a given text input based on the provided context",
      parameters: [
        {
          in: "body",
          name: "body",
          description: "Request body containing the text input and context",
          required: true,
          schema: {
            type: "object",
            properties: {
              dialogue: {
                type: "object",
                properties: {
                  question: {
                    type: "string",
                  },
                },
              },
            },
          },
        },
      ],
      responses: {
        200: {
          description: "successful operation",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  items: {
                    type: "string",
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Invalid request",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    description: "Error message",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
