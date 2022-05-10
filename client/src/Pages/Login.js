/* eslint-disable react-hooks/exhaustive-deps */
import React, {useRef, useState, useEffect} from "react";
import { CssBaseline, Box, Button, Typography, TextField, Avatar, Grid, Container } from "@mui/material";
import * as Icons from "@mui/icons-material/";  //Facebook, Google

import { useAuth, useLoading } from '../Context';
import { Axios, loginApi, tokenRenewApi } from '../Api';
import { DatabaseRequest } from '../Classes';
import { useGoTo, useGotFrom, useTranslation } from '../Hooks';
import { tokens, sizes, colors } from '../Config';

import RegisterPopup from "./RegisterPopup";
import GoogleLogin from "react-google-login";
import FacebookLogin from "react-facebook-login";

const googleClientID = tokens.googleClientID;
const facebookClientId = tokens.facebookClientId;

export default function Registration() {
  const { t } = useTranslation();
  const { auth, setAuth } = useAuth();
  const { setAxiosLoading, setAlert } = useLoading();
  const goTo = useGoTo();
  const gotFrom = useGotFrom();

  function goFrom(){
    if(gotFrom === '/') return goTo('/Location');
    return goTo(gotFrom);
  }

  const [openPopUp, setOpenPopUp] = React.useState(false);
  const handleClose = () => { setOpenPopUp(false); };
  const handleClickOpen = () => { setOpenPopUp(true); };

  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const errRef = useRef(null);
  const [errMsg, setErrMsg] = useState('');
  useEffect(() => {
    emailRef.current.value = auth.email || '';
    passwordRef.current.value = auth.password || '';
    emailRef.current.focus(); 
    }, [handleClose] );

  useEffect(() => { checkAccessToken(auth, setAuth, goFrom, setAxiosLoading, setAlert, setAlert, setErrMsg); }, [] );
  const facebookButtonStyle = { '& button':  {height: '48px',  display: 'inline-flex',  borderRadius: '4px ! important', boxShadow: `1px 1px ${colors.facebookButton.boxShadowColor}`, textShadow: `1px 1px ${colors.facebookButton.textShadowColor}`, width: '100%' }, '& button i': {marginLeft: '-10px', marginTop: '-6px',  fontSize: sizes.facebookFontSize}, '& button span': {width: '100%', fontSize: sizes.facebookFontSize, textAlign: 'center', marginTop: '-4px'  } };
  const googleButtonStyle =  { '& button': { width: '100%' },'& button span':  { width: '75%,', fontSize: sizes.googleFontSize, textAlign: 'center' } };
return (<>
<Container maxWidth="lg">
  <Typography variant="h1"> {t("Game Login")} </Typography>
  <Grid container>
    <Grid item xs={12} md={6} sx={{ mt: 8, display:'flex', flexDirection: 'column', alignItems: 'center', }}>
      <CssBaseline />
      <Avatar sx={{ m: 1, bgcolor: 'primary.main', width: '70px ! important', height: '70px ! important'  }}> <Icons.LockOutlined /> </Avatar>
      <Box component="form" onSubmit={(e) => handleSubmit(e, setErrMsg, goTo, setAuth, auth, setAxiosLoading, setAlert ) } noValidate sx={{ mt: 1 }}>
        <TextField label={t("Email")} autoFocus id="email" autoComplete="email" name="email" inputRef={emailRef} margin="normal" fullWidth required />
        <TextField label={t("Password")} name="password" id="password" type="password" inputRef={passwordRef} autoComplete="current-password" margin="normal" fullWidth required />
        {/*<FormControlLabel label={t("Remember me")}  control={<Checkbox value="remember" color="primary" />} /> */}  
        <Typography variant="body2" color="primary" ref={errRef} >|{errMsg}|</Typography>
        <Button startIcon={<Icons.Login/>}  type="submit" fullWidth variant="contained" > {t("Sign In")} </Button>
      </Box>
    </Grid>
    <Grid item xs={12} md={6} sx={{mt: 20, mb: {xs: 5, md: 30}, display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
      <Box component="div" sx={{width: '90%'}}> {/*little bit smaller area*/}
        <Box component='div' className="googleButton" sx={{mb: 1, ...googleButtonStyle}}> <GoogleLogin buttonText={t("Google Login")} clientId={googleClientID} onSuccess={(response) => responseSuccessGoogle(response, setAuth, goTo, setAxiosLoading, setAlert)} onFailure={()=>{setAlert('fail to login with google account')}} cookiePolicy={'single_host_origin'} /> </Box>
        <Box component='div' className="facebookButton" sx={{mb: 1, ...facebookButtonStyle}}> <FacebookLogin textButton={<span>{t("Facebook Login")}</span>} icon="fa-facebook" appId={facebookClientId} autoLoad={false} callback={(response) => responseFacebook(response, setAuth, goTo, setAxiosLoading, setAlert) } onFailure={()=>{setAlert('fail to login with facebook')}} /> </Box>
        <Button startIcon={<Icons.SwitchAccount/>} fullWidth variant="contained" onClick={handleClickOpen} > {t("Registration")} </Button>
      </Box>
    </Grid>
  </Grid>
  <RegisterPopup open={openPopUp} handleClose={handleClose} />
</Container>
</>);
}

const handleSubmit = (event, setErrMsg, goTo, setAuth, auth, setAxiosLoading, setAlert) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  new DatabaseRequest( () => loginApi( {email: data.get('email'), password: data.get('password')} ) )
    .GoodResult( (result) => { setAuth( result ); goTo("/Location"); } )
    .BadResult( (error) => { setErrMsg(error); setAlert(error); } )
    .Build(setAxiosLoading);  
};

function checkAccessToken(auth, setAuth, goFrom, setAxiosLoading, setAlert, setErrMsg){
  new DatabaseRequest( () => tokenRenewApi() )
    .GoodResult( (result) => {
      if(!result._id || !result.accessToken) return;
      setAuth( result ); goFrom();
      } )
    .Build(setAxiosLoading);
}

const responseFacebook = (response, setAuth, goTo, setAxiosLoading, setAlert) => {
  const data = { token: response.accessToken, userId: response.id };
  new DatabaseRequest( () => Axios('POST', '/api/login/facebook', data, {}) )
    .GoodResult( (result) => { setAuth( result ); goTo("/Location"); } )
    .BadResult( (error) => { setAlert(error); } )
    .Build(setAxiosLoading);  
};

const responseSuccessGoogle = (response, setAuth, goTo, setAxiosLoading, setAlert) => {
  const data =  { token: response.tokenId };
  new DatabaseRequest( () => Axios('POST', '/api/login/google', data, {}) )
    .GoodResult( (result) => { setAuth( result ); goTo("/Location"); } )
    .BadResult( (error) => { setAlert(error); } )
    .Build(setAxiosLoading);  
};



