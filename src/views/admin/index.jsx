import React, { useEffect, useState } from "react";
import { Provider, defaultTheme, Button, TextField, Form, Heading, View } from '@adobe/react-spectrum';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/footer";
import AgreementAction from "../../components/agreement-action";

function setup() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (params) => {
    try {
      const apiUrl = `/api/admin-login`;
      const reqBody = { 
        email,
        password
      };
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(reqBody),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Fetched Agreements Data:", data);
        
        dispatch(setAgreements(data.agreementAssetsResults));
        navigate("/agreementsList");
      } else {
        console.error("API call failed", response.statusText);
        alert("Failed to fetch agreements. Please try again later.");
      }
    } catch (error) {
      console.error("Error making API call:", error);
      alert("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
    console.log("Logging in...");
  };

  return (
    <Provider theme={defaultTheme}>
      <View
        width="size-3600"
        backgroundColor="gray-100"
        padding="size-200"
        margin="auto"
        height="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
          <Heading level={1}>Login</Heading>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            isRequired
            width="100%"
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            isRequired
            width="100%"
          />
          <AgreementAction
            params={{ email, password }}
            onAction={handleLogin}
            buttonText="Login"
            isDisabled={!email}
            heading="Bulk Operation Tool setup"
          />
      </View>
      <View gridArea="footer" width="100%" height={"size-1000"}>
        <Footer
          disableBack={true}
          disableExecute={true}
        />
      </View>
    </Provider>
  );
}

export default setup;
