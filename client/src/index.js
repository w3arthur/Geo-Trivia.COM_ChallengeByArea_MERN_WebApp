import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import "./components/multilanguage/i18next";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

import { AuthProvider } from "./context";
import Loading from './components/Loading';
ReactDOM.render(<React.StrictMode>
  <Suspense fallback={<div>Loading<Loading /></div>}>
    <AuthProvider>
      <BrowserRouter> <App /> </BrowserRouter>
    </AuthProvider>
  </Suspense>
</React.StrictMode>, document.getElementById("root"));
