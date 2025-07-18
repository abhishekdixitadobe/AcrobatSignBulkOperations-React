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

import React, { useEffect, useState } from "react";
import {
  Flex,
  View,
  Link,
  Image,
  Heading,
  Button,
} from "@adobe/react-spectrum";
import AppLogo from "./appLogo.jpg";
import ChevronLeft from "@spectrum-icons/workflow/ChevronLeft";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutSuccess } from "../../services/authService";

const Header = () => {
  const location = useLocation();
  const [isLandingPage, setIsLandingPage] = useState(true);
  const history = useNavigate();
  const navigate = useNavigate();
  const authState = useSelector((state) => state.auth || {});
  const isAuthenticated = authState.isAuthenticated || false; // Default to false if undefined
  const user = authState.user; // This will be undefined if not set

  const dispatch = useDispatch();

  useEffect(() => {
    if (location.state?.configs) {
      setIsLandingPage(true);
    } else {
      setIsLandingPage(false);
    }
  }, [location.state]);

  const handleBackClick = () => {
    history(-1);
  };
  const handleLogout = () => {
    dispatch(logoutSuccess()); // Dispatch the logout action
    navigate("/login"); // Redirect the user to the login page
  };

  return (
    <View backgroundColor={"gray-50"} height="100%">
      <Flex direction="row" height="100%" gap="size-100" alignItems={"center"} justifyContent="space-between">
        <View paddingStart={"size-300"}>
          <Flex direction="row" alignItems="center" gap="size-100">
            <Link isQuiet>
              <a href="/">
                <Image
                  src={AppLogo}
                  height={"size-400"}
                  alt={"DragonFly-Logo"}
                />
              </a>
            </Link>
            {!isLandingPage ? (
              <Flex direction="row">
                <Heading level={3}>{"Bulk Operations Tool"}</Heading>
              </Flex>
            ) : (
              <Flex direction="row" alignItems="center">
                <Button
                  onPress={handleBackClick}
                  aria-label={"Head Back Button"}
                  UNSAFE_style={{ border: "none" }}
                  UNSAFE_className="cursorPointer"
                >
                  <ChevronLeft size="M" />
                </Button>
                <Heading level={3}>{"Back"}</Heading>
              </Flex>
            )}
          </Flex>
        </View>
        {/* Right section with Welcome message and Sign out */}
        <View paddingEnd={"size-300"}>
          <Flex direction="row" alignItems="center" gap="size-200">
            {isAuthenticated && (
              <>
                <Heading level={4}>Welcome, {user.firstName}</Heading>{" "}{/* Display username */}
                <Button onPress={handleLogout} variant="primary" UNSAFE_className="cursorPointer">
                  Sign Out
                </Button>
              </>
            )}
          </Flex>
        </View>
      </Flex>
    </View>
  );
};

export default Header;
