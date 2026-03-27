import { Button, Heading, Image, Text, Content, Card } from "@react-spectrum/s2";
import { style } from "@react-spectrum/s2/style";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAPI, setLandingPage } from "../../redux/navState";

const ActionCard = ({
  heading,
  description,
  imageUrl,
  configs,
  isDisabled,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleNavigation = () => {
    dispatch(setAPI(configs.api));
    dispatch(setLandingPage(false));
    navigate(configs.page, { state: { heading, configs } });
  };

  return (
    <Card>
      <Image src={imageUrl} />
      <Heading>{heading}</Heading>

      <Content>
        <div
          className={style({
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between"
          })}
        >
          <div className={style({ display: "flex" })}>
            {description}
          </div>

          <div
            className={style({
              display: "flex",
              marginStart: 16
            })}
          >
            <Button
              variant="accent"
              fillStyle="fill"
              onPress={handleNavigation}
              isDisabled={isDisabled}
              styles={style({
                cursor: "pointer",
                whiteSpace: "nowrap"
              })}
            >
              <Text>Get started</Text>
            </Button>
          </div>
        </div>
      </Content>
    </Card>
  );
};

export default ActionCard;
