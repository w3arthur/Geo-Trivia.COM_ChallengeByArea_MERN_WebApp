import React, {useRef, useState, useEffect} from "react";
import { useTranslation } from "react-i18next";
import GoogleLogin from "react-google-login";
import FacebookLogin from "react-facebook-login";

import { Link, useNavigate, useLocation } from "react-router-dom";
import { CssBaseline, Box, Button, Typography, TextField, Avatar, Grid, Container } from "@mui/material";
import * as Icons from "@mui/icons-material/";  //Facebook, Google

import RegisterPopup from "./RegisterPopup";

import {useAuth} from '../../context';
import {Axios, loginApi, tokenRenewApi} from '../../api';
import {DatabaseRequest, User} from '../../classes';

export default function Registration() {
  const { t } = useTranslation();

  //Arthur
  const { auth, setAuth } = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const navigate = useNavigate();
  function goFrom(){ navigate(from, { replace: true });  }

  const emailRef = useRef( null );
  const passwordRef = useRef( null );
  const errRef = useRef( null );
  const [errMsg, setErrMsg] = useState('');

  const [openPopUp, setOpenPopUp] = React.useState(false);
  const [handleClose, handleClickOpen] = [() => { setOpenPopUp(false); }, () => { setOpenPopUp(true); }];


useEffect(() => {
    checkAccessToken(auth, setAuth, goFrom, setErrMsg);
    console.log('auth' ,auth);
    emailRef.current.value = auth.email || '';
    passwordRef.current.value = auth.password || '';
    emailRef.current.focus(); 
  }, [] );

  return (<>
    
    <Container >
      <Typography variant="h1" sx={{ fontWeight: "bold" }}> {t("Login with")} </Typography>

      <Grid container>

        <Grid item xs={12} md={6} sx={{ mt: 8, display:'flex', flexDirection: 'column', alignItems: 'center', }}>
          <CssBaseline />
          <Avatar sx={{ m: 1, bgcolor: 'primary.main', width: '70px ! important', height: '70px ! important'  }}> <Icons.LockOutlined /> </Avatar>

          <Box component="form" onSubmit={(e) => handleSubmit(e, setErrMsg, goFrom, setAuth, auth ) } noValidate sx={{ mt: 1 }}>

            <TextField  autoFocus id="email" autoComplete="email" name="email" inputRef={emailRef}
              label={t("Email")} margin="normal" fullWidth required />

            <TextField name="password" id="password" type="password" inputRef={passwordRef}
                label={t("Password")} autoComplete="current-password" margin="normal" fullWidth required />

            {/*<FormControlLabel label="Remember me" control={<Checkbox value="remember" color="primary" />} /> */}  
            
            <Typography variant="body2" color="primary" ref={errRef} >|{errMsg}|</Typography>
            
            <Button  type="submit" fullWidth variant="contained" > Sign In </Button>

          </Box>
          {/*<Link to="/Registration" onClick={() => loginHandler( form )}> {t("Login")} </Link>*/}

          </Grid>

          <Grid item xs={12} md={6} sx={{mt: 20, mb: {xs: 5, md: 30}, display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
          <Box component="div" sx={{width: '90%'}}>
              {/*edit button under box*/}
            <FacebookLogin appId="691605551987315" autoLoad={false} callback={responseFacebook} />

            <GoogleLogin  clientId="602070662525-cg5up3456lcbdngu7nhji2j6inpi8t1b.apps.googleusercontent.com"
              buttonText="Google" onSuccess={responseSuccessGoogle} onFailure={responseErrorGoogle} cookiePolicy={"single_host_origin"} />
          
            <Button fullWidth variant="contained" onClick={handleClickOpen} > {t("Registration")} </Button>

            <RegisterPopup open={openPopUp} handleClose={handleClose} aria-labelledby="customized-dialog-title" />
            
          </Box>
        </Grid>
      </Grid>
    </Container>
    </>);
}



const handleSubmit = (event, setErrMsg, goFrom, setAuth, auth) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  console.log( { email: data.get('email'), password: data.get('password'), } );
  new DatabaseRequest( () => loginApi( {email: data.get('email'), password: data.get('password')} ) )
    .GoodResult( (result) => {
      setAuth( new User(result.name, result.email, result.role, result.accessToken) ) //set roll
      console.log('auth', auth);
      goFrom();
      } )
    .BadResult( (error) => { setErrMsg(error); } )
    .Build();
    
};

function checkAccessToken(auth, setAuth, goFrom, setErrMsg){
  new DatabaseRequest( () => tokenRenewApi() )
    .GoodResult( (result) => {
      result.role = [result.type];
      delete result.type; //to delete
      const role = 2001;  //to delete
      if(!result.email || !result.accessToken) return;  //prevent endless loop because of login try if no email
      setAuth( new User(result.name, result.email, [role], result.accessToken) ) //set roll
      console.log('auth', auth);
      goFrom();
      } )
    .Build();
}


const responseFacebook = (response) => {
  console.log(response);
  const data = { accessToken: response.accessToken, userID: response.userID };
  new DatabaseRequest(()=>{Axios('POST', 'http://localhost:3500/api/auth/facebook', data, {})})
  .BadResult((result)=>{  console.log("Facebook login success, client side", result); })
  .GoodResult((error)=>{})
  .Build();
};

const responseSuccessGoogle = (response) => {
  console.log(response);
  const data = { tokenId: response.tokenId };
  new DatabaseRequest(()=>{Axios('POST', 'http://localhost:3500/api/auth/google', data, {})})
  .BadResult((result)=>{  console.log("Google login success", result); })
  .GoodResult((error)=>{})
  .Build();
};


const responseErrorGoogle = (response) => {  };


