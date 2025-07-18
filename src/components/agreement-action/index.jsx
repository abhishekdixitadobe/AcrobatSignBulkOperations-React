import { Button, Text } from "@adobe/react-spectrum";
import React from "react";

const AgreementAction = ({ params, onAction, buttonText = "Submit", isDisabled, configs = {}, heading }) => {
  const handleButtonClick = () => {
    if (onAction) {
      onAction(params); // Trigger the passed action with provided parameters
    }
  };

  return (
        <Button
          UNSAFE_style={{ whiteSpace: "nowrap" }}
          UNSAFE_className="cursorPointer"
          variant="accent"
          style="fill"
          onPress={handleButtonClick}
          isDisabled={isDisabled}
          alignSelf="end"
          marginTop="15px"
        >
          <Text>{buttonText}</Text>
        </Button>
  );
};

export default AgreementAction;
