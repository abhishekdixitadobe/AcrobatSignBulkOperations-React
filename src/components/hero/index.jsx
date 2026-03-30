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


import { Text } from "@react-spectrum/s2";
import { style } from "@react-spectrum/s2/style";
import background from "./PD-DSBanner.png";

const Hero = () => {
  return (
    <div
      className="hero-banner"
      style={{
        backgroundImage: `url(${background})`,
        backgroundRepeat: "no-repeat",
        height: "200px",
        backgroundSize: "cover",
        overflow: "hidden",
        borderRadius: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        className={style({
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center"
        })}>
        <Text
          style={{
            fontSize: "40px",
            color: "#ffffff"
          }}
        >
          Bulk Operations Tool
        </Text>
        <Text style={{
          color: "#ffffff"
        }}>
          One Stop Solution for actions in bulk.
        </Text>
        
      </div>
    </div>
  );
};

export default Hero;
