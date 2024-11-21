import React from "react";
import { View, Flex, Heading, Text, Grid } from "@adobe/react-spectrum";
import Footer from "../../components/footer";
import infoData from "./infoData";
import { useLocation } from "react-router-dom";
import ArrowDown from "@spectrum-icons/workflow/ArrowDown";

const Info = (props) => {
  const location = useLocation();
  const { state } = location;
  const pageName = state && state.heading;
  const title = infoData[pageName] && infoData[pageName].Title;
  const subTitle = infoData[pageName] && infoData[pageName].SubTitle;
  const configs = state && state.configs;

  const renderActions = () => {
    if (infoData[pageName]) {
      const lastAction = infoData[pageName].Actions.length - 1;
      return infoData[pageName].Actions.map((action, index) => {
        const actionName = Object.keys(action)[0];
        const actionDescription = Object.values(action)[0];

        return (
          <Grid
            key={actionName}
            areas={["action content", "arrow blank"]}
            columns={["1fr", "3fr"]}
            // height="size-2000"
            gap="size-100"
          >
            <View
              backgroundColor="static-blue-500"
              borderRadius="medium"
              gridArea="action"
              padding="size-300"
            >
              <Flex justifyContent="center" alignItems="center" height="100%">
                <Text>
                  <span style={{ color: "white" }}>{actionName}</span>
                </Text>
              </Flex>
            </View>
            <View gridArea="content">
              <Flex height="100%" alignItems="center">
                <Text>{actionDescription}</Text>
              </Flex>
            </View>
            {index !== lastAction && (
              <>
                <View gridArea="arrow">
                  <Flex justifyContent="center" alignItems="center">
                    <ArrowDown size="XL" color="informative" />
                  </Flex>
                </View>
                <View gridArea="blank" />
              </>
            )}
          </Grid>
        );
      });
    }
    return null;
  };

  const renderChallenges = () => {
    if (infoData[pageName]) {
      return (
        <ul>
          {infoData[pageName].Challenges.map((challenge, index) => (
            <li key={index}>
              <Text>{challenge}</Text>
            </li>
          ))}
        </ul>
      );
    }
    return null;
  };

  const renderImpact = () => {
    if (infoData[pageName]) {
      return (
        <ul>
          {infoData[pageName].Impact.map((impact, index) => (
            <li key={index}>
              <Text>{impact}</Text>
            </li>
          ))}
        </ul>
      );
    }
    return null;
  };

  return (
    <Grid
      areas={["content", "footer"]}
      height="100%"
      width="100%"
      columns={["1fr"]}
      rows={["1fr", "auto"]}
    >
      <View gridArea="content" width="75%" marginX="auto">
        <Flex
          direction="column"
          width="75%"
          height={"100%"}
          gap={20}
          alignItems={"center"}
          marginX="auto"
        >
          <View width="100%">
            <Heading level={1}>{title}</Heading>
            <Text>{subTitle}</Text>
          </View>
          <View width="100%">
            <Flex direction="column" width="100%" gap="size-100">
              {renderActions()}
            </Flex>
          </View>
          <View width="100%">
            <Flex direction="row" width="100%" gap="20px">
              <Flex direction="column" width="50%">
                <View>
                  <Heading level={2}>Challenges</Heading>
                </View>
                {renderChallenges()}
              </Flex>
              <Flex direction="row" width="100%">
                <Flex direction="column">
                  <View>
                    <Heading level={2}>Impact</Heading>
                  </View>
                  {renderImpact()}
                </Flex>
              </Flex>
            </Flex>
          </View>
        </Flex>
      </View>
      <View gridArea="footer" width="100%" height={"size-1000"}>
        <Footer configs={configs} heading={pageName} />
      </View>
    </Grid>
  );
};

export default Info;
