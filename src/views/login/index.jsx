import React, { useEffect, useState } from "react";
import { login } from "../../services/authService";
import { Button, Flex, Heading, Image, Text, View  } from "@adobe/react-spectrum";
import { Card } from "@react-spectrum/card";
import { Content } from "@react-spectrum/view";
import backgroundImage from "./login-background.png";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [authUrl, setAuthUrl] = useState('');

    const handleLogin = () => {
        try {
          window.location.href = "/api/auth-url"; // Redirect to a validated URL
        } catch (error) {
          console.error("Invalid URL provided for redirection:", error);
          alert("An error occurred. Please try again.");
        }
     // window.location.href = AUTH_URL;
    };
    const handleIntegrationLogin = () => {
        window.location.href = "https://localhost:3000/integrationKey";
     // window.location.href = AUTH_URL;
    };
    const handleAdminLogin = () => {
      console.log("Admin login button clicked");
      navigate('/adminLogin/');
    };
    // Access environment variables
    const showOAuthLogin = process.env.REACT_APP_SHOW_OAUTH_LOGIN === 'true';
    const showIntegrationLogin = process.env.REACT_APP_SHOW_INTEGRATION_LOGIN === 'true';

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
          position: "relative"
        }}
      >
        <View
        backgroundColor="white"
        padding="size-400"
        borderRadius="medium"
        boxShadow="0px 4px 16px rgba(0, 0, 0, 0.2)"
        width="300px"
        UNSAFE_style={{
          textAlign: "center",
          padding: "2rem"
        }}
      >
        <Card>
            <Content>
                      {showOAuthLogin && (
                        <Button
                           UNSAFE_style={{
                            width: "100%",
                            marginBottom: "1rem",
                            backgroundColor: "#0070d2",
                            color: "white"
                          }}
                            variant="accent"
                            style="fill"
                            onPress={handleLogin}
                        >
                            <Text>Login with Adobe Sign</Text>
                        </Button>
                      )}
                        {showIntegrationLogin && (
                            <Button
                                UNSAFE_style={{
                                    width: "100%",
                                    marginBottom: "1rem",
                                    backgroundColor: "#0070d2",
                                    color: "white"
                                }}
                                variant="accent"
                                style="fill"
                                onPress={handleIntegrationLogin}
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
      </View>
      </div>
    );
  };
  
  export default Login;
