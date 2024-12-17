/* ************************************************************************
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

import { Button, Flex, Heading, Image, Text } from "@adobe/react-spectrum";
import { Card } from "@react-spectrum/card";
import { Content } from "@react-spectrum/view";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAPI, setLandingPage } from "../../redux/navState";
import React from "react";

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
        <Flex direction="row" justifyContent="space-between">
          <Flex>{description}</Flex>
          <Flex marginStart="size-200">
            <Button
              UNSAFE_style={{ whiteSpace: "nowrap" }}
              variant="accent"
              style="fill"
              onPress={handleNavigation}
              isDisabled={isDisabled}
            >
              <Text>Get started</Text>
            </Button>
          </Flex>
        </Flex>
      </Content>
    </Card>
  );
};

export default ActionCard;
