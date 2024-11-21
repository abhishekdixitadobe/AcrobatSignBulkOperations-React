import { ActionButton, Grid, Image, View } from "@adobe/react-spectrum";
import Download from "@spectrum-icons/workflow/Download";
import React, { useEffect, useState } from "react";
import Footer from "../../components/footer";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { useSelector } from "react-redux";

const Result = () => {
  const resultImages =
    useSelector((state) => state.downloadURLs.downloadURLs) || [];
  console.log(resultImages);
  const downloadImage = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const filename = url.split("/").pop();
    saveAs(blob, filename);
  };

  const downloadAllasZip = async () => {
    const zip = new JSZip();
    const folder = zip.folder("images");
    for (let i = 0; i < resultImages.length; i++) {
      const imgData = await fetch(resultImages[i]).then((r) => r.blob());
      folder.file(`image${i + 1}.jpg`, imgData, { binary: true });
    }
    zip.generateAsync({ type: "blob" }).then(function (content) {
      saveAs(content, "result.zip");
    });
  };

  return (
    <Grid
      areas={["content", "footer"]}
      height="100%" // Subtract the height of the footer
      width="100%"
      columns={["1fr"]}
      rows={["1fr", "auto"]}
      marginTop={"size-200"}
    >
      <View gridArea="content" width="75%" marginX="auto" overflow="auto">
        <Grid columns={"1fr 1fr 1fr 1fr"} gap="size-400">
          {resultImages.map((src, index) => (
            <View
              position="relative"
              key={index}
              width="size-3600"
              height="size-3600"
            >
              <a href={src} target="_blank" rel="noopener noreferrer">
                <Image
                  src={src}
                  objectFit="contain"
                  width="100%"
                  height="100%"
                  alt=""
                />
              </a>
              <View position="absolute" top="size-50" end="size-50">
                <ActionButton
                  onPress={() => downloadImage(resultImages[index])}
                  isQuiet
                >
                  <Download />
                </ActionButton>
              </View>
            </View>
          ))}
        </Grid>
      </View>
      <View gridArea="footer" width="100%" height={"size-1000"}>
        <Footer
          showDownload={true}
          downloadOnPress={async () => {
            // Download all the images in a zip
            downloadAllasZip();
          }}
        />
      </View>
    </Grid>
  );
};

export default Result;
