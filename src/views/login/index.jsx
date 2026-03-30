import React from "react";
import { Button, Text } from "@react-spectrum/s2";
import { style } from "@react-spectrum/s2/style";
import backgroundImage from "./login-background.png";

const Login = () => {
  const handleLogin = () => {
    try {
      window.location.href = "/api/auth-url";
    } catch (error) {
      console.error("Invalid URL provided for redirection:", error);
      alert("An error occurred. Please try again.");
    }
  };
  const handleIntegrationLogin = () => {
    window.location.href = "https://localhost:3000/integrationKey";
  };

  const showOAuthLogin = process.env.REACT_APP_SHOW_OAUTH_LOGIN === "true";
  const showIntegrationLogin = process.env.REACT_APP_SHOW_INTEGRATION_LOGIN === "true";

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: `url(${backgroundImage}) no-repeat center center`,
        backgroundSize: "cover",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "12px",
          padding: "32px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          boxShadow: "0px 8px 24px rgba(0,0,0,0.2)",
          minWidth: "280px",
        }}
      >
        {showOAuthLogin && (
          <Button variant="accent" fillStyle="fill" onPress={handleLogin}>
            <Text>Login with Adobe Sign</Text>
          </Button>
        )}
        {showIntegrationLogin && (
          <Button variant="accent" fillStyle="fill" onPress={handleIntegrationLogin}>
            <Text>Login with Integration key</Text>
          </Button>
        )}
      </div>
    </div>
  );
};

export default Login;
