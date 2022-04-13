import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import "./components/Multilanguage/i18next";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

ReactDOM.render(
  <Suspense fallback={<div>Loading</div>}>
    <BrowserRouter>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </BrowserRouter>
  </Suspense>,
  document.getElementById("root")
);
