import logo from './logo.svg';
import './App.css';
import axios, { Axios } from 'axios';
import { useState } from 'react';
const API=axios.create({
  baseURL:'https://jsonplaceholder.typicode.com',
  timeout:30000,
});
function App() {
const [apirespons,setapirespose]=useState({})
const [loading,setloading]=useState(false)
  const makegetapicall=()=>{
    setloading(true);
  axios.request({
    method:'GET',
    url:'https://jsonplaceholder.typicode.com/todos',

  }).then(res=>{
    setapirespose(res.data)
  }).catch(err=>{
    setapirespose(err)
  }).finally(()=>{
    setloading(false)
  });
  }
  const makepostapi=()=>{
    setloading(true);
    API.post("/posts",{
      titel:"my custome titel",
      completed:false,
      
    })
    .then((res)=>{
      setapirespose(res.data);
    })
    .catch((err)=>{
      setapirespose(err);
    })
    .finally(()=>{
      setloading(false);
    });
    
  };
  return (
    <div className="App">
      
   <button onClick={makegetapicall}>Get api</button>
   <button onClick={makepostapi}>make post api</button>
   
   <div>{loading?"loading..":  JSON.stringify(apirespons)}</div>
    </div>
  );
}

export default App;
