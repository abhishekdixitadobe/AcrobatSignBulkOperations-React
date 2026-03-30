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
import { Link, Image, Heading, Button } from "@react-spectrum/s2";
import { style } from "@react-spectrum/s2/style";
import AppLogo from "./appLogo.jpg";
import ChevronLeft from "@react-spectrum/s2/icons/ChevronLeft";
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
    <div
      className={style({
        backgroundColor: "gray-25",
        height: "full"
      })}>
      <div
        className={style({
          display: "flex",
          flexDirection: "row",
          height: "full",
          gap: 8,
          alignItems: "center",
          justifyContent: "space-between"
        })}>
        <div className={style({
          paddingStart: 24
        })}>
          <div
            className={style({
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 8
            })}>
            <Link isQuiet href="/">
              <Image
                src={AppLogo}
                alt={"DragonFly-Logo"}
                styles={style({
                  height: 32
                })}
              />
            </Link>
            {!isLandingPage ? (
              <div className={style({
                display: "flex",
                flexDirection: "row"
              })}>
                <Heading level={3}>{"Bulk Operations Tool"}</Heading>
              </div>
            ) : (
              <div
                className={style({
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center"
                })}>
                <Button
                  onPress={handleBackClick}
                  aria-label={"Head Back Button"}
                  fillStyle="plain"
                >
                  <ChevronLeft size="M" />
                </Button>
                <Heading level={3}>{"Back"}</Heading>
              </div>
            )}
          </div>
        </div>
        {/* Right section with Welcome message and Sign out */}
        <div className={style({
          paddingEnd: 24
        })}>
          <div
            className={style({
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 16
            })}>
            {isAuthenticated && (
              <>
                <Heading level={4}>Welcome, {user.firstName}</Heading>{" "}{/* Display username */}
                <Button onPress={handleLogout} variant="primary"
                  styles={style({
                    cursor: "pointer"
                  })}>
                  Sign Out
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
