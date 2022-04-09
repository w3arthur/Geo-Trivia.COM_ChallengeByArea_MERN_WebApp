import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Avatar, Button, CssBaseline, TextField, FormControlLabel, 
  Checkbox, Link as MuiLink, Grid, Box, Typography, Container } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

import {useAuth} from '../context';
import {Axios, Async} from '../api';
import {User} from '../classes';


export default function Login() {
  const { auth, setAuth } = useAuth();
  
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const navigate = useNavigate();

  function goFrom(){
    navigate(from, { replace: true });
  }

  const userRef = React.useRef('fghfghhfg');
  const passwordRef = React.useRef();
  const errRef = React.useRef();
  const [errMsg, setErrMsg] = React.useState('');



  React.useEffect(() => {
    checkAccessToken(auth, setAuth, goFrom, setErrMsg);

    console.log('auth' ,auth);
    userRef.current.value = auth.email || '';
    passwordRef.current.value = auth.password || '';
    userRef.current.focus(); 
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ ] );



  return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}> <LockOutlinedIcon /> </Avatar>
          <Typography component="h1" variant="h5"> Sign in </Typography>
          <Box component="form" onSubmit={(e) => handleSubmit(e, setErrMsg, goFrom, setAuth, auth )} noValidate sx={{ mt: 1 }}>
            <TextField inputRef={userRef} margin="normal" required fullWidth id="email" label="Email Address"
              name="email" autoComplete="email" autoFocus />
            <TextField inputRef={passwordRef} margin="normal" required fullWidth name="password" label="Password"
              type="password" id="password" autoComplete="current-password" />
            <FormControlLabel label="Remember me" control={<Checkbox value="remember" color="primary" />} />
            <Typography variant="body2" color="text.secondary" ref={errRef} >|{errMsg}|</Typography>
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}> Sign In </Button>
            <Grid container variant="body2">
              <Grid item xs> <Link to="#"> Forgot password? </Link> </Grid>
              <Grid item> <Link to="/register"  > {"Don't have an account? Sign Up"} </Link> </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
  );
}

const handleSubmit = (event, setErrMsg, goFrom, setAuth, auth) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  console.log({ email: data.get('email'), password: data.get('password'), });

  Async( async() => {
    try{
      const result = await Axios('POST', '/api/login', {email: data.get('email'), password: data.get('password')}, {});
      if(await result) {
        result.role = [result.type];
        delete result.type; //?
        const role = 2001; //?[admin]
        setAuth( new User(result.name, result.email, [role], result.accessToken) ) //set roll
        console.log('auth', auth);
        goFrom();// return;
      } 
      
      console.log('resultLogin ',result);
    }catch(error){ setErrMsg(error || 'no server connection');}
  });

};

function checkAccessToken(auth, setAuth, goFrom, setErrMsg){
    Async( async() => {
      const result = await Axios('PATCH', '/api/login', {}, {});
      if(await result.error) return;
      else if(await result) {
        result.role = [result.type];
        delete result.type; //to delete
        const role = 2001;  //to delete
        if(!result.email || !result.accessToken) return;  //prevent endless loop because of login try if no email
        setAuth( new User(result.name, result.email, [role], result.accessToken) ) //set roll
        console.log('auth', auth);
        goFrom();
    } else setErrMsg('no server connection');
    console.log('resultLogin ',result);
  });
}

const Copyright = props =>  (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '} <MuiLink color="inherit" href="https://mui.com/"> Your Website </MuiLink> {' '} {new Date().getFullYear()} {'.'}
    </Typography>
);