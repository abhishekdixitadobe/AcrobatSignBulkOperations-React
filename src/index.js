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

import { defaultTheme, Provider } from "@react-spectrum/s2";
import { ToastContainer } from "@react-spectrum/s2";
import { style } from "@react-spectrum/s2/style";
import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Provider as ReduxProvider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./app-router";
import Header from "./components/header";
import store from "./redux/store";
import "./styles.css";

// Bootstrap the React App
const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

const App = () => {

  return (
    <Provider theme={defaultTheme} colorScheme="light">
      <BrowserRouter>
        <div className="applicationContentWrapper">
          <ToastContainer placement="top" />
          <div
            className={style({
              display: "flex",
              flexDirection: "column",
              height: "full"
            })}>
            <div
              className={style({
                borderBottomWidth: 1,
                borderBottomColor: "gray-300"
              })}>
              <Header />
            </div>
            <div
              className={style({
                flexGrow: 1,
                backgroundColor: "gray-75"
              })}>
              <AppRouter />
            </div>
          </div>
        </div>
      </BrowserRouter>
    </Provider>
  );
};

root.render(
  <ReduxProvider store={store}>
    <App />
  </ReduxProvider>
);
