import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import './Api/i18next'
import App from "./App";
import { BrowserRouter } from "react-router-dom";

import Loading from './Components/Loading';
ReactDOM.render(<React.StrictMode><Suspense fallback={<Loading />}>
     <BrowserRouter>
      <App /> 
    </BrowserRouter>
</Suspense></React.StrictMode>, document.getElementById("root"));
