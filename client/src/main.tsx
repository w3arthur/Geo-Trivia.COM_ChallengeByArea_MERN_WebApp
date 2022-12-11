import React, { } from 'react'
import ReactDOM, { createRoot } from 'react-dom/client'
import './Api/i18next'
import App from "./App";



const container = document.getElementById('root');
const root = createRoot(container as HTMLElement); //ts
root.render(<> <App /> </>);




// react 17
// import ReactDOM from 'react-dom';
// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );
