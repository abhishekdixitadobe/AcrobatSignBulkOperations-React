import { ActionButton, Button, Image } from "@react-spectrum/s2";
import { style } from "@react-spectrum/s2/style";
import Close from "@react-spectrum/s2/icons/Close";

import PhotoshopIcon from "./images/photoshop.png";
const ImageGrid = ({
  filledSrc,
  handleRemoveIndividualClick,
  handleRemoveClick,
}) => (
  <div
    className={style({
      display: "flex",
      flexDirection: "column",
      gap: "[30px]",
      alignItems: "center"
    })}>
    <div
      className={style({
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 8
      })}>
      {filledSrc.map((src, index) => (
        <div
          key={index}
          className={style({
            position: "relative",
            width: 160,
            height: 160
          })}>
          <Image
            src={src.name.split(".").pop() === "psd" ? PhotoshopIcon : src.url}
            objectFit="contain"
            alt=""
            styles={style({
              width: "full",
              height: "full"
            })} />
          <div
            className={style({
              position: "absolute",
              top: 4,
              insetEnd: 4
            })}>
            <ActionButton
              onPress={() => handleRemoveIndividualClick(index)}
              isQuiet
            >
              <Close />
            </ActionButton>
          </div>
        </div>
      ))}
    </div>
    <Button variant="negative" onClick={handleRemoveClick}>
      Remove all images
    </Button>
  </div>
);

export default ImageGrid;
