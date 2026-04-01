import React, {useState } from "react";
import { Provider, defaultTheme, Button, TextField, Form, Heading, View } from '@adobe/react-spectrum';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/footer";
import AgreementAction from "../../components/agreement-action";
import { ToastQueue } from "@react-spectrum/toast";

function Setup() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (params) => {
    try {
      if (!email || !password) {
        ToastQueue.negative("Please enter valid credentials", {timeout: 5000});
        return;
      }

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
        
        dispatch(setAgreements(data.agreementAssetsResults));
        navigate("/agreementsList");
      } else {
        console.error("API call failed", response.statusText);
        ToastQueue.negative("An error occurred. Please try again later.", {timeout: 5000});
      }
    } catch (error) {
      console.error("Error making API call:", error);
      ToastQueue.negative("An error occurred. Please try again later.", {timeout: 5000});
    } finally {
    }
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
        <Form validationBehavior="native" isRequired necessityIndicator="label">
          <Heading level={1} UNSAFE_style={{ textAlign: "center" }}>Login</Heading>
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
            // isDisabled={!email}
            heading="Bulk Operation Tool setup"
          />
        </Form>
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

export default Setup;
