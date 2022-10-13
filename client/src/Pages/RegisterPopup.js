import React, { useState, useEffect, useRef } from "react";
import { Avatar, Typography, TextField, Button, Box, CssBaseline } from "@mui/material";
import * as Icons from "@mui/icons-material/"; 

import { useAuth, useLoading } from '../Context';
import { userRegisterApi } from '../api';
import { DatabaseRequest, User } from '../Classes';
import { PopUp } from '../Components'
import { useTranslation } from '../Hooks'

export default function ResterPopUp({open, handleClose}){
  const { t } = useTranslation()
  const { setAxiosLoading, setAlert } = useLoading();
  const [errMsg, setErrMsg] = useState('');
  const errRef = useRef(' ');
  const nameRef = useRef( null );
  const registerButtonRef = useRef( null );

  const { setAuth } = useAuth();

  useEffect(
    () => {
      errRef.current ='';
      nameRef.current?.focus();
    }, []
  );

const render = () => (<>
<PopUp open={open} handleClose={handleClose} title={t("Register")} handleSubmit={()=>{registerButtonRef.current.click()}} submitText={t("Register")} >
  <CssBaseline />
  <Box sx={{ marginTop: 1, display: 'flex', flexDirection: 'column', alignItems: 'center'}} >
      <Avatar sx={{ m: 1, bgcolor: 'primary.main', width: '70px ! important', height: '70px ! important'}}> <Icons.LockOutlined /> </Avatar>
      <Typography component="h1" variant="h5"> {t("Sign up")} </Typography>
      <Box component="form" noValidate onSubmit={(event) => handleSubmit(event)} sx={{ mt: 3 }}>
        <TextField label={t('Name')} autoFocus autoComplete="name" inputRef={nameRef} id="name" name="name" fullWidth />
        <TextField label={t('Email')} autoComplete="email" id="email" name="email" fullWidth/>
        <Box sx={{ alignItems: 'left', width: '100%'}}>
          <TextField label={t('Age')} type="number" id="age" name="age" sx={{width: '40%'}} />
        </Box>
        <TextField label={t('Password')} id="password" name="password" type="password" autoComplete="new-password" helperText="minimum 6 symbols" fullWidth />
          {/* <TextField label={t('Confirm password')} name="passwordConfirm" type="password" fullWidth /> */}
        <Box sx={{ textAlign: 'center', width: '100%'}}>
          <Typography variant="body2" color="primary" ref={errRef}>|{errMsg}|</Typography>
          <Button startIcon={<Icons.PersonAddAlt/>} ref={registerButtonRef} type="submit" variant="contained"> {t('Registration')} </Button>
        </Box>
    </Box>
  </Box>
</PopUp>
</>);


const handleSubmit = ( event ) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  console.log({ email: form.get('email'), password: form.get('password'), });
  const userData = {
    name: form.get('name')
    , email: form.get('email')
    , password: form.get('password')
  }
  new DatabaseRequest( () => userRegisterApi(userData) )
    .GoodResult( async (result) => {
        const resultClone = JSON.parse(JSON.stringify(result));
        resultClone.password = form.get('password');
        setAuth(resultClone);
        handleClose();
      } )
    .BadResult( (error) => { setErrMsg(error); setAlert(error); } )
    .Build(setAxiosLoading);
};


return render();};

