import React, {useRef, useState, useEffect} from "react";
import { CssBaseline, Box, Button, Typography, TextField, Avatar, Grid, Container } from "@mui/material";
import * as Icons from "@mui/icons-material/";  //Facebook, Google

import { useAuth, useLoading } from '../Context';
import { Axios, loginApi/*, tokenRenewApi*/ } from '../Api';
import { DatabaseRequest } from '../Classes';
import { useGoTo , useTranslation } from '../Hooks';
import { tokens } from '../Config';

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            
            <Button startIcon={<Icons.Login/>}  type="submit" fullWidth variant="contained" > Sign In </Button>

          </Box>
          {/*<Link to="/Registration" onClick={() => loginHandler( form )}> {t("Login")} </Link>*/}

          </Grid>

          <Grid item xs={12} md={6} sx={{mt: 20, mb: {xs: 5, md: 30}, display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
          <Box component="div" sx={{width: '90%'}}>
              {/*edit button under box*/}
              
            <Box component='div' className="googleButton" sx={{mb: 1}}> <GoogleLogin buttonText="Google Login" clientId={googleClientID} onSuccess={(response) => responseSuccessGoogle(response, setAuth, goTo, setAxiosLoading, setAlert)} onFailure={()=>{setAlert('fail to login with google account')}} cookiePolicy={'single_host_origin'} /> </Box>
            <Box component='div' className="facebookButton" sx={{mb: 1}}> <FacebookLogin textButton={<span>Facebook Login</span>} icon="fa-facebook" appId={facebookClientId} autoLoad={false} callback={(response) => responseFacebook(response, setAuth, goTo, setAxiosLoading, setAlert) } onFailure={()=>{setAlert('fail to login with facebook')}} /> </Box>

            <Button startIcon={<Icons.SwitchAccount/>} fullWidth variant="contained" onClick={handleClickOpen} > {t("Registration")} </Button>

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
      setAuth( resultClone ) //set rolls
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


const responseFacebook = (response, setAuth, goTo, setAxiosLoading, setAlert) => {
  const data = { token: response.accessToken, userId: response.id };
  new DatabaseRequest( () => Axios('POST', '/api/login/facebook', data, {}) )
    .GoodResult( (result) => {
      const resultClone = JSON.parse(JSON.stringify(result));
      delete resultClone.password;
      setAuth( resultClone ) //set rolls
      goTo("/Location");
      } )
    .BadResult( (error) => { setAlert(error); } )
    .Build(setAxiosLoading);  
};

const responseSuccessGoogle = (response, setAuth, goTo, setAxiosLoading, setAlert) => {
  const data =  { token: response.tokenId };
  new DatabaseRequest( () => Axios('POST', '/api/login/google', data, {}) )
    .GoodResult( (result) => {
      const resultClone = JSON.parse(JSON.stringify(result));
      delete resultClone.password;
      setAuth( resultClone ) //set rolls
      goTo("/Location");
      } )
    .BadResult( (error) => { setAlert(error); } )
    .Build(setAxiosLoading);  
};



