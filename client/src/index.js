import React, {  } from "react";
import { createRoot } from 'react-dom/client';
import './Api/i18next'
import App from "./App";

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<React.StrictMode>  <App /> </React.StrictMode>);
