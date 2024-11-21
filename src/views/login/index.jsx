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

    useEffect(() => {
      // Fetch the OAuth URL from the backend using POST
      fetch('/api/auth-url', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json', // Specify JSON content type
          },
          body: JSON.stringify({ requestType: 'oauth' }) // Optional request body
      })
          .then(response => {
              if (!response.ok) {
                  throw new Error(`HTTP error! Status: ${response.status}`);
              }
              return response.json();
          })
          .then(data => setAuthUrl(data.url))
          .catch(error => console.error('Error fetching auth URL:', error));
  }, []);

    const handleLogin = () => {
      if (authUrl) {
        window.location.href = authUrl; // Redirect the user to the OAuth URL
      }
     // window.location.href = AUTH_URL;
    };
    const handleAdminLogin = () => {
      console.log("Admin login button clicked");
      navigate('/adminLogin/');
    };
  
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
