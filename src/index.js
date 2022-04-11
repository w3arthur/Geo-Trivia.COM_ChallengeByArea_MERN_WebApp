import React, {Suspense} from 'react';
import ReactDOM from 'react-dom';
import '../src/components/i18next';
import './index.css';
import App from './App';

ReactDOM.render(<Suspense fallback={(<div>Loading</div>)}> <React.StrictMode> <App /> </React.StrictMode></Suspense>, document.getElementById('root') );

