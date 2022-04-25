import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import "./Components/multilanguage/i18next";
import "./Styles/index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

import { AuthProvider, PlayingTeam } from "./Context";
import Loading from './Components/Loading';
ReactDOM.render(<React.StrictMode>
  <Suspense fallback={<div>Loading<Loading /></div>}>
    <AuthProvider> <PlayingTeam>
      <BrowserRouter> <App /> </BrowserRouter>
    </PlayingTeam> </AuthProvider>
  </Suspense>
</React.StrictMode>, document.getElementById("root"));
