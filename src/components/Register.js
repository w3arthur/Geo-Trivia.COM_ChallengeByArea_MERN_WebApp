import React, { useEffect } from 'react';
import { /*Link,*/ useNavigate, useLocation } from 'react-router-dom';
import { Avatar, Button, CssBaseline, TextField, FormControlLabel, 
  Checkbox, Link as MuiLink, Grid, Box, Typography, Container} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

import {useAuth} from '../context';
import {userRegisterApi} from '../api';
import {DatabaseRequest, User} from '../classes';

export default function Register() {
  const errRef = React.useRef(' ');
  const [errMsg, setErrMsg] = React.useState('');

  const { setAuth } = useAuth();

  const location = useLocation();
  let from = location.state?.from?.pathname || "/";
  if (from === '/register' || from === 'register') from = '/login'

  const navigation = useNavigate()
 
  function goFrom(){ navigation(from, { replace: true }); }
  
  useEffect(() => {
    errRef.current.ch ='';
  },[]);
  
  return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', }} >
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}> <LockOutlinedIcon /> </Avatar>
          <Typography component="h1" variant="h5"> Sign up </Typography>
          <Box component="form" noValidate onSubmit={(e) => handleSubmit(e, setErrMsg, setAuth, goFrom)} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}> <TextField autoComplete="given-name" name="firstName" required fullWidth id="firstName" label="First Name" autoFocus /> </Grid>
              <Grid item xs={12} sm={6}> <TextField required fullWidth id="lastName" label="Last Name" name="lastName" autoComplete="family-name" /> </Grid>
              <Grid item xs={12}> <TextField required fullWidth id="email" label="Email Address" name="email" autoComplete="email" /> </Grid>
              <Grid item xs={12}> <TextField required fullWidth name="password" label="Password" type="password" id="password" autoComplete="new-password" /> </Grid>
              <Grid item xs={12}> <FormControlLabel control={<Checkbox value="allowExtraEmails" color="primary" />} label="I want to receive inspiration, marketing promotions and updates via email." /> </Grid>
            </Grid>
            <Typography variant="body2" ref={errRef}>{errMsg}</Typography>
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} > Sign Up </Button>
            <Grid container justifyContent="flex-end">
              <Grid item> <MuiLink href="#" variant="body2"> Already have an account? Sign in </MuiLink> </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
  );
}

const handleSubmit = (event, setErrMsg, setAuth, goFrom) => {
  
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  console.log({ email: data.get('email'), password: data.get('password'), });
  const user = new User( 
    data.get('firstName') + ' ' + data.get('lastName')
    , data.get('email')
    , undefined
    , undefined
  );
  user.password =  data.get('password');
  new DatabaseRequest( () => userRegisterApi(user) )
    .GoodResult( (result) => {
        result.role = [result.type];
        delete result.type;
        result.password = data.get('password');
        setAuth(result);
        goFrom();
      } )
    .BadResult( (error) => { setErrMsg(error); } )
    .Build();

};

const Copyright = props => (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '} <MuiLink color="inherit" href="https://mui.com/"> Your Website </MuiLink> {' '} {new Date().getFullYear()} {'.'}
    </Typography>
);