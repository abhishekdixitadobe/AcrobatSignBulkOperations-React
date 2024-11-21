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

export const listObjects = async (path) => {
    //const s3 = await getS3Client();
    /*const params = {
        Bucket: BUCKET_NAME,
        Delimiter: '',
        Prefix: path
      };*/
    const response = await fetch(`/api/listObjects?path=${encodeURIComponent(path)}`);
     if (!response.ok) {
         throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
     }
     return await response.json();
   //const data = await s3.listObjectsV2(params).promise();
   //return data.Contents;
}

export const putObject = async (file) => {
  try {
      const formData = new FormData();
      formData.append('image', file);
      const response = await fetch('/api/uploadObject', {
          method: 'POST',
          body: formData
      });
      if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
      }
      return response.json();
  } catch (error) {
      console.error('Error in putObject:', error);
      throw error;
  }
}



export const getSignedURL = async (operation, path) => {
  try {
      const response = await fetch('/api/signedURL', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ operation, path })
      });
      if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
      }
      return response.json();
  } catch (error) {
      console.error('Error in getSignedURL:', error);
      throw error;
  }
}
