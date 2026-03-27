import { Heading, Text, View } from "@react-spectrum/s2";
import { style } from "@react-spectrum/s2/style";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import ActionCard from "../../components/action-card";
import Hero from "../../components/hero";
import useCaseData from "./useCaseData";
import { reset } from "../../redux/navState";
import ProtectedRoute from "../../components/protected-route";

const Landing = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(reset());
  }, [dispatch]);

  return (
    <div
      className={style({
        display: "flex",
        flexDirection: "column",
        width: "[75%]",
        height: "full",
        gap: 20,
        alignItems: "center",
        marginX: "[auto]"
      })}
    >
      <View
        marginTop="32"
        width="100%"
      >
        <Hero />
      </View>

      <div
        className={style({
          display: "flex",
          flexDirection: "column",
          gap: "[50px]"
        })}
      >
        <div
          className={style({
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 24,
            marginBottom: 80
          })}
        >
          {useCaseData.map((usecase) => (
            <ActionCard
              key={usecase.id}
              imageUrl={usecase.cardImageUrl}
              heading={usecase.name}
              description={usecase.description}
              configs={usecase.configs}
              isDisabled={usecase.isDisabled}
              api={usecase.configs}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Landing;
