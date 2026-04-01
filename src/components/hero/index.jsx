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

import React from "react";
import { Flex, Text } from "@adobe/react-spectrum";
import background from "./PD-DSBanner.png";

const Hero = () => {
  return (
    <div
      className="hero-banner"
      style={{
        backgroundImage: `url(${background})`,
        backgroundRepeat: "no-repeat",
        height: "100px",
        backgroundSize: "cover",
        overflow: "hidden",
        borderRadius: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Flex
        direction={"column"}
        alignItems={"center"}
        justifyContent={"center"}
      >
        <Text
          UNSAFE_style={{
            fontSize: "40px",
            color: "var(--spectrum-global-color-gray-100)",
          }}
        >
          Bulk Operations Tool
        </Text>
        <Text UNSAFE_style={{ color: "var(--spectrum-global-color-gray-100)" }}>
        One Stop Solution for actions in bulk.
        </Text>
        
      </Flex>
    </div>
  );
};

export default Hero;
