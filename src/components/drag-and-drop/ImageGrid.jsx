import { ActionButton, Button, Flex, Image, View } from "@adobe/react-spectrum";
import Close from "@spectrum-icons/workflow/Close";
import React from "react";
import PhotoshopIcon from "./images/photoshop.png";
const ImageGrid = ({
  filledSrc,
  handleRemoveIndividualClick,
  handleRemoveClick,
}) => (
  <Flex direction="column" gap={30} alignItems="center">
    <Flex wrap="wrap" justifyContent="center" gap="size-100">
      {filledSrc.map((src, index) => (
        <View
          position="relative"
          key={index}
          width="size-2000"
          height="size-2000"
        >
          <Image
            src={src.name.split(".").pop() === "psd" ? PhotoshopIcon : src.url}
            objectFit="contain"
            width="100%"
            height="100%"
            alt=""
          />
          <View position="absolute" top="size-50" end="size-50">
            <ActionButton
              onPress={() => handleRemoveIndividualClick(index)}
              isQuiet
            >
              <Close />
            </ActionButton>
          </View>
        </View>
      ))}
    </Flex>
    <Button variant="negative" onClick={handleRemoveClick}>
      Remove all images
    </Button>
  </Flex>
);

export default ImageGrid;
