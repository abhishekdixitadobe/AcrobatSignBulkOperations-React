/*************************************************************************
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

import { Button, Content, Heading, IllustratedMessage, Text, DropZone } from "@react-spectrum/s2";
import { style } from "@react-spectrum/s2/style";


import { FileTrigger } from "react-aria-components";
import FileDisplay from "./FileDisplay";
import ImageGrid from "./ImageGrid";
import CSVDisplay from "./CSVDisplay";
import { useDispatch } from "react-redux";
import { Upload } from "@react-spectrum/s2/icons/upload";

const DragAndDrop = (props) => {
  const {
    onImageDrop,
    heading,
    description,
    acceptedFileTypes,
    allowsMultiple,
    setUploadFiles,
  } = props;
  const [filledSrc, setFilledSrc] = React.useState([]);
  const [files, setFiles] = React.useState([]);
  const validImageTypes = [
    "image/jpeg",
    "image/png",
    "image/vnd.adobe.photoshop",
    "image/x-photoshop",
    "image/psd",
    "application/photoshop",
    "application/psd",
    "zz-application/zz-winassoc-psd",
    "application/octet-stream",
  ];

  const isAllAcceptedImage = acceptedFileTypes.every((type) =>
    validImageTypes.includes(type)
  );
  const isAllAcceptedCSV = acceptedFileTypes.every(
    (type) => type === "text/csv"
  );
  const dispatch = useDispatch();

  const handleObjectDrop = async (files) => {
    console.log("Dropped files: ", files);
    const acceptedFiles = Array.from(files.items).filter(
      (item) => item.kind === "file" && acceptedFileTypes.includes(item.type)
    );
    let droppedFiles = [];
    await Promise.all(
      acceptedFiles.map(async (item) => {
        const file = await item.getFile();
        setFilledSrc((prevState) => [
          ...prevState,
          {
            url: URL.createObjectURL(file),
            name: file.name,
          },
        ]);
        setFiles((prevFiles) => [...prevFiles, file]);
        droppedFiles.push(file); // Assuming you want to add the file to droppedFiles
      })
    );
    if (droppedFiles.length > 0) onImageDrop(droppedFiles);
  };

  const handleFileSelect = (event) => {
    const files = Array.from(event);
    if (files.length > 0) {
      const fileUrls = files.map((file) => {
        return {
          url: URL.createObjectURL(file),
          name: file.name,
        };
      });
      setFilledSrc(fileUrls);
      onImageDrop(files);
    }
  };

  const handleRemoveClick = () => {
    setFilledSrc([]);
    setFiles([]);
  };

  const handleRemoveIndividualClick = (index) => {
    setFilledSrc((prevFilledSrc) => {
      const newFilledSrc = [...prevFilledSrc];
      newFilledSrc.splice(index, 1);
      return newFilledSrc;
    });

    setFiles((prevFiles) => {
      const newFiles = [...prevFiles];
      newFiles.splice(index, 1);
      return newFiles;
    });

    setUploadFiles((prevFiles) => {
      const newFiles = [...prevFiles];
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  return (
    <div
      className={style({
        display: "flex",
        flexDirection: "column",
        gap: "[30px]",
        height: "full",
        marginBottom: 16
      })}>
      <DropZone
        isFilled={!!filledSrc}
        getDropOperation={(types) => {
          let isAccepted = false;
          for (let type of acceptedFileTypes) {
            if (types.has(type)) {
              isAccepted = true;
              break;
            }
          }
          return isAccepted ? "copy" : "cancel";
        }}
        onDrop={(e) => handleObjectDrop(e)}
        styles={style({
          minHeight: 160
        })}
        style={{
          padding: "25px"
        }}
      >
        {filledSrc.length > 0 ? (
          isAllAcceptedImage ? (
            <ImageGrid
              filledSrc={filledSrc}
              handleRemoveIndividualClick={handleRemoveIndividualClick}
              handleRemoveClick={handleRemoveClick}
              alt=""
            />
          ) : isAllAcceptedCSV ? (
            <CSVDisplay
              filledSrc={filledSrc}
              handleRemoveIndividualClick={handleRemoveIndividualClick}
            />
          ) : (
            <FileDisplay
              filledSrc={filledSrc}
              handleRemoveIndividualClick={handleRemoveIndividualClick}
            />
          )
        ) : (
          <IllustratedMessage>
            <Upload />
            <Heading>
              <Text slot="label">{heading}</Text>
            </Heading>
            <Content>
              <Text slot="label">{description}</Text>
            </Content>
            <FileTrigger
              acceptedFileTypes={acceptedFileTypes}
              allowsMultiple={allowsMultiple}
              onSelect={handleFileSelect}
            >
              <Button
                variant="accent"
                fillStyle="fill"
                styles={style({
                  cursor: "pointer"
                })}
                style={{
                  marginTop: "20px"
                }}
              >
                Browse files
              </Button>
            </FileTrigger>
          </IllustratedMessage>
        )}
      </DropZone>
    </div>
  );
};

export default DragAndDrop;
