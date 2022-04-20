import './App.css';
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Navbar from './commponent/NavBar';

import Home from './commponent/Home';
import Create from './commponent/Create';
import Note from './commponent/Note';

const Homepage=()=>{
  return( 
 <Home></Home>
  )
}
const Noteapp=()=>{
  return( 
 <Note></Note>
  )
}
const CreateE=()=>{
  return( 
 <Create></Create>
  )
}
 
  

function App() {
  return (
    
  <BrowserRouter>
  <Navbar></Navbar>
  <Routes>
  <Route path="/" exact  element={<Homepage/>}></Route>
  <Route path="/note" element={<Noteapp/>}></Route>
  <Route path="/create" element={<CreateE/>}></Route>
 
  </Routes>
  
  </BrowserRouter>
    
   
  );
}

export default App;
