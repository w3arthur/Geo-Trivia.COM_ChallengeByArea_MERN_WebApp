import React, {  } from "react";
import './Api/i18next'
import App from "./App";

// import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<React.StrictMode>  <App /> </React.StrictMode>);


// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );
