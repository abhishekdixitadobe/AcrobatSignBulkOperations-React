import React, { useEffect, useState } from "react";
import { Card } from "@react-spectrum/s2";
import { Button, Text, Content } from "@react-spectrum/s2";
import { style } from "@react-spectrum/s2/style";
import backgroundImage from "./login-background.png";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    try {
      window.location.href = "/api/auth-url"; // Redirect to a validated URL
    } catch (error) {
      console.error("Invalid URL provided for redirection:", error);
      alert("An error occurred. Please try again.");
    }
  };
  const handleIntegrationLogin = () => {
    window.location.href = "https://localhost:3000/integrationKey";
  };
  // Access environment variables
  const showOAuthLogin = process.env.REACT_APP_SHOW_OAUTH_LOGIN === "true";
  const showIntegrationLogin = process.env.REACT_APP_SHOW_INTEGRATION_LOGIN === "true";

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: `url(${backgroundImage}) no-repeat center center fixed`,
        backgroundSize: "cover",
        padding: "20px",
        position: "relative",
      }}
    >
      <div
        boxShadow="0px 4px 16px rgba(0, 0, 0, 0.2)"
        className={style({
          backgroundColor: "white",
          padding: 32,
          borderRadius: "lg",
          width: 300,
          textAlign: "center"
        })}
        style={{
          padding: "2rem"
        }}>
        <Card>
          <Content>
            {showOAuthLogin && (
              <Button
                styles={style({
                  cursor: "pointer"
                })}
                variant="accent"
                fillStyle="fill"
                onPress={handleLogin}
                style={{
                  width: "100%",
                  marginBottom: "1rem",
                  backgroundColor: "#0070d2",
                  color: "white"
                }}
              >
                <Text>Login with Adobe Sign</Text>
              </Button>
            )}
            {showIntegrationLogin && (
              <Button
                styles={style({
                  cursor: "pointer"
                })}
                variant="accent"
                fillStyle="fill"
                onPress={handleIntegrationLogin}
                style={{
                  width: "100%",
                  marginBottom: "1rem",
                  backgroundColor: "#0070d2",
                  color: "white"
                }}
              >
                <Text>Login with Integration key</Text>
              </Button>
            )}
            {/* Commenting out the "Login as tool admin" button */}
            {/*
                        <Button
                           UNSAFE_style={{
                            width: "100%",
                            marginBottom: "1rem",
                            backgroundColor: "#0070d2",
                            color: "white"
                          }}
                            variant="accent"
                            style="fill"
                            onPress={handleAdminLogin}
                        >
                            <Text>Login as tool admin</Text>
                        </Button> */}
          </Content>
        </Card>
      </div>
    </div>
  );
};

export default Login;
