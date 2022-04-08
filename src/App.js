import React from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate  } from 'react-router-dom';  // useParams,

import { AuthProvider } from './context/AuthProvider';
import GlobalLayout from './components/GlobalLayout'
import RequireAuth from './components/RequireAuth';
import Login from './components/Login';
import Register from './components/Register';

const {User, Editor, Admin}  = {  //ROLES
  User: 2001
  , Editor: 1984
  , Admin: 5150
}


export default function App() { return (<div className="App">
  <BrowserRouter> <AuthProvider>
    <PageLinks />
    <br />
    <Routes>
      <Route path="/" element={<GlobalLayout />}>
        <Route index element={<>[-IndexPage-]<br /></>} />
        <Route path="pageA" element={<>[-PageA-]</>} />

        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
    
        <Route element={<RequireAuth allowedRoles={[User]}/>}>
          <Route index element={<>(1)Index</>} />
        </Route>
        <Route element={<RequireAuth allowedRoles={[Editor]}/>}>
          <Route path="editor" element={<>(2)Editors Page</>} />
        </Route>
        <Route element={<RequireAuth allowedRoles={[Admin]}/>}>
          <Route path="admin" element={<>(3)Admin Page</>} />
        </Route>
        <Route element={<RequireAuth allowedRoles={[Editor, Admin]}/>}>
          <Route path="lounge" element={<>(4)Lounge Page</>} />
        </Route>
        {/*
        <Route path="/mui" element={<><MuiReferences /></>}></Route>
        <Route path="/items">
          <Route index element={<><Items state={this.state} /></>} />
          <Route path=":value" element={<><Items state={this.state} /></>} />
        </Route>
        <Route path="basket" element={<><Basket state={this.state} /></>} />
        */}
        {/* 
        <Route path="redux1" element={<><ReduxReference1 /></>} />
        <Route path="redux2" element={<><ReduxReference2 /></>} />
        <Route path="reduxFetch/*" element={<><ReduxFetch /></>} />
        <Route path="ReduxFetchFun/*" element={<><ReduxFetchFun /></>} />
        */}
      </Route>
      <Route path="unauthorized" element={<> [-PageError403-] (Error 403 Unauthorized) <BackwardLink /> <br /></>} />
      <Route path="*" element={<>[-PageError404-] (Error 404 Page not found) <BackwardLink /> <br /></>} />
    </Routes>
  </AuthProvider> </BrowserRouter>
</div>); }

const BackwardLink = () => {
  const navigate = useNavigate();
  return (<button onClick={() => navigate(-1)} >Go Back</button>)
}

const PageLinks = () => { return (<section>
    Page Links<br />
    Public:{' '}
    <Link to="/login">Login</Link>{' | '}
    <Link to="/register">Register</Link>{' | '}
    
    Private:{' '}
    <Link to="/">index</Link>{' | '}
    <Link to="/editor">Editors Page</Link>{' | '}
    <Link to="/admin">Admin Page</Link>{' | '}
    <br />
    <Link to="/">index</Link>{' | '}
    <Link to="./PageA">PageA</Link>{' | '}
    <Link to="./Basket">Basket</Link>{' | '}
    <Link to="./Items">Items</Link>{' | '}
    <Link to="./Mui">Mui</Link>{' | '}
    <Link to="./Redux1">ReduxReference1</Link>{' | '}
    <Link to="./Redux2">ReduxReference2</Link>{' | '}
    <Link to="./ReduxFetch">ReduxFetch</Link>{' | '}
    <Link to="./ReduxFetchFun">ReduxFetchFun</Link>{' | '}
    <Link to="/Error">Error</Link>
</section>)}