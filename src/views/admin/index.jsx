import React, {useState } from "react";
import { Provider, defaultTheme } from '@react-spectrum/s2';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/footer";
import AgreementAction from "../../components/agreement-action";
import { Button, TextField, Form, Heading, ToastQueue } from "@react-spectrum/s2";
import { style } from "@react-spectrum/s2/style";

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
      <div
        display="flex"
        alignItems="center"
        justifyContent="center"
        className={style({
          width: 288,
          backgroundColor: "gray-75",
          padding: 16,
          margin: "[auto]",
          height: "[100vh]"
        })}>
        <Form isRequired necessityIndicator="label">
          <Heading level={1} style={{
            textAlign: "center"
          }}>Login</Heading>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            isRequired
            styles={style({
              width: "full"
            })}
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            isRequired
            styles={style({
              width: "full"
            })}
          />
          <AgreementAction
            params={{ email, password }}
            onAction={handleLogin}
            buttonText="Login"
            // isDisabled={!email}
            heading="Bulk Operation Tool setup"
          />
        </Form>
      </div>
      <div
        className={style({
          gridArea: "footer",
          width: "full",
          height: 80
        })}>
        <Footer
          disableBack={true}
          disableExecute={true}
        />
      </div>
    </Provider>
  );
}

export default Setup;
