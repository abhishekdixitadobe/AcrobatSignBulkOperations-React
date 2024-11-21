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

import { Flex, Grid, Heading, Text, View } from "@adobe/react-spectrum";
import React, { useEffect } from "react";
import ActionCard from "../../components/action-card";
import Hero from "../../components/hero";
import useCaseData from "./useCaseData";
import { useDispatch } from "react-redux";
import { reset } from "../../redux/navState";
import ProtectedRoute from "../../components/protected-route";

const Landing = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(reset());
  }, []);

  return (
    <Flex
      direction="column"
      width="75%"
      height={"100%"}
      gap={20}
      alignItems={"center"}
      marginX="auto"
    >
      <View height={"size-2600"} marginTop={"size-400"} width={"100%"}>
        <Hero />
      </View>
      <View>
        <Flex direction={"column"} gap={50}>
          <Grid
            columns={"1fr 1fr 1fr"}
            gap="size-300"
            marginBottom={"size-1000"}
          >
            {useCaseData.map((usecase) => (
              <View key={usecase.id}>
                <ActionCard
                  imageUrl={usecase.cardImageUrl}
                  heading={usecase.name}
                  description={usecase.description}
                  configs={usecase.configs}
                  isDisabled={usecase.isDisabled}
                  api={usecase.configs}
                />
              </View>
            ))}
          </Grid>
        </Flex>
      </View>
    </Flex>
  );
};

export default Landing;
