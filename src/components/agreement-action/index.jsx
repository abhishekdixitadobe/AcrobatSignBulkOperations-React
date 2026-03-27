import { Button, Text } from "@react-spectrum/s2";
import { style } from "@react-spectrum/s2/style";


const AgreementAction = ({ params, onAction, buttonText = "Submit", isDisabled, configs = {}, heading }) => {
  const handleButtonClick = () => {
    if (onAction) {
      onAction(params); // Trigger the passed action with provided parameters
    }
  };

  return (
    <Button
      variant="accent"
      fillStyle="fill"
      onPress={handleButtonClick}
      isDisabled={isDisabled}
      styles={style({
        alignSelf: "end",
        marginTop: "[15px]",
        cursor: "pointer"
      })}
      style={{
        whiteSpace: "nowrap"
      }}>
      <Text>{buttonText}</Text>
    </Button>
  );
};

export default AgreementAction;
