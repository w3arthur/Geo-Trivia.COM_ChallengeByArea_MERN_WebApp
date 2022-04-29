import React, {useRef, useState, useEffect} from "react";
import { CssBaseline, Box, Button, Typography, TextField, Avatar, Grid, Container } from "@mui/material";
import * as Icons from "@mui/icons-material/";  //Facebook, Google

import { useAuth, useLoading } from '../Context';
import { Axios, loginApi/*, tokenRenewApi*/ } from '../Api';
import { DatabaseRequest } from '../Classes';
import { useGoTo , useTranslation } from '../Hooks'

import RegisterPopup from "./RegisterPopup";
//import GoogleLogin from "react-google-login";
//import FacebookLogin from "react-facebook-login";

export default function Registration() {
  const { t } = useTranslation();

  const { auth, setAuth } = useAuth();
  const { setAxiosLoading, setAlert } = useLoading();

  const goTo = useGoTo();

  const emailRef = useRef( null );
  const passwordRef = useRef( null );
  const errRef = useRef( null );
  const [errMsg, setErrMsg] = useState('');

  const [openPopUp, setOpenPopUp] = React.useState(false);
  const [handleClose, handleClickOpen] = [() => { setOpenPopUp(false); }, () => { setOpenPopUp(true); }];


  useEffect(() => {
    checkAccessToken(auth, setAuth, goTo, setAxiosLoading, setErrMsg);
    emailRef.current.value = auth.email || '';
    passwordRef.current.value = auth.password || '';
    emailRef.current.focus(); 
    }, [handleClose] );


  return (<>
    
    <Container maxWidth="lg">
      <Typography variant="h1" sx={{ fontWeight: "bold" }}> {t("Login with")} </Typography>

      <Grid container>

        <Grid item xs={12} md={6} sx={{ mt: 8, display:'flex', flexDirection: 'column', alignItems: 'center', }}>
          <CssBaseline />
          <Avatar sx={{ m: 1, bgcolor: 'primary.main', width: '70px ! important', height: '70px ! important'  }}> <Icons.LockOutlined /> </Avatar>

          <Box component="form" onSubmit={(e) => handleSubmit(e, setErrMsg, goTo, setAuth, auth, setAxiosLoading, setAlert ) } noValidate sx={{ mt: 1 }}>
            
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
              {/*
            <FacebookLogin appId="691605551987315" autoLoad={false} callback={responseFacebook} />

            <GoogleLogin  clientId="602070662525-cg5up3456lcbdngu7nhji2j6inpi8t1b.apps.googleusercontent.com"
              buttonText="Google" onSuccess={responseSuccessGoogle} onFailure={responseErrorGoogle} cookiePolicy={"single_host_origin"} />
           */}
            <Button fullWidth variant="contained" onClick={handleClickOpen} > {t("Registration")} </Button>

            <RegisterPopup open={openPopUp} handleClose={handleClose}  />
            
          </Box>
        </Grid>
      </Grid>
    </Container>
    </>);
}

const handleSubmit = (event, setErrMsg, goTo, setAuth, auth, setAxiosLoading, setAlert) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  console.log( { email: data.get('email'), password: data.get('password'), } );
  new DatabaseRequest( () => loginApi( {email: data.get('email'), password: data.get('password')} ) )
    .GoodResult( (result) => {
      const resultClone = JSON.parse(JSON.stringify(result));
      delete resultClone.password;
      setAuth( resultClone ) //set roll
      goTo("/Location");
      } )
    .BadResult( (error) => { setErrMsg(error); setAlert(error); } )
    .Build(setAxiosLoading);  
};

function checkAccessToken(auth, setAuth, goFrom, setAxiosLoading, setErrMsg){
  // not available on POC version!
  // new DatabaseRequest( () => tokenRenewApi() )
  //   .GoodResult( (result) => {
  //     if(!result.email || !result.accessToken) return;  //prevent endless loop because of login try if no email
  //     const resultClone = JSON.parse(JSON.stringify(result));
  //     delete resultClone.password;
  //     setAuth( resultClone );
  //     goFrom();
  //     } )
  //   .Build(setAxiosLoading);
}


const responseFacebook = (response, setAxiosLoading) => {
  console.log(response);
  const data = { accessToken: response.accessToken, userID: response.userID };
  new DatabaseRequest(()=>{Axios('POST', 'http://localhost:3500/api/auth/facebook', data, {})})
  .BadResult((result)=>{  console.log("Facebook login success, client side", result); })
  .GoodResult((error)=>{})
  .Build(setAxiosLoading);
};

const responseSuccessGoogle = (response, setAxiosLoading) => {
  console.log(response);
  const data = { tokenId: response.tokenId };
  new DatabaseRequest(()=>{Axios('POST', 'http://localhost:3500/api/auth/google', data, {})})
  .BadResult((result)=>{  console.log("Google login success", result); })
  .GoodResult((error)=>{})
  .Build(setAxiosLoading);
};


const responseErrorGoogle = (response) => {  };


