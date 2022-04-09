import React from 'react';
import { /*BrowserRouter,*/ Routes, Route, Link,  } from 'react-router-dom';  // useParams,

import {Item, History} from './components';

import { LocationContextProvider } from './context';
import { ReduxProvider } from './reducers';

export default function LocationReduxExample(){
    return ( 
  <div className="App">
    Weather API:<br />
    {/*<Link to="/">/</Link>*/}{' | '}
    <Link to="./Item">Item</Link>{' | '}
    <Link to="./History">History</Link>{' | '}
    <br />
    <ReduxProvider> <LocationContextProvider>
        <Routes>
          <Route path="/">
            <Route index element={<><Item /></>} />
            <Route path="/item" element={<><Item /></>} />
            <Route path="/history" element={<><History /></>} />
          </Route>
          <Route path="*" element={<>Error<br /></>} />
        </Routes>
    </LocationContextProvider> </ReduxProvider>
  </div>
  
   );

}
 


