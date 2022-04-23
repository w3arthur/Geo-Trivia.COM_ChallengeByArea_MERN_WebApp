import React, { useState, useEffect, useRef } from "react";
import { Link,  useNavigate, useLocation  } from "react-router-dom";
import { useTranslation } from 'react-i18next';

import PropTypes from 'prop-types'; //?
import { Avatar, Typography, TextField, Button, Box, CssBaseline } from "@mui/material";
import * as Icons from "@mui/icons-material/"; 

import { useAuth } from '../Context';
import { userRegisterApi } from '../Api';
import { DatabaseRequest, User } from '../Classes';
import { PopUp } from '../Components'

export default function ResterPopUp({open, handleClose}){
  const { t } = useTranslation()

  const [errMsg, setErrMsg] = useState('');
  const errRef = useRef(' ');
  const nameRef = useRef( null );
  const registerButtonRef = useRef( null );

  const { setAuth } = useAuth();

  const location = useLocation();
  let from = location.state?.from?.pathname || "/";
  if (from === '/register' || from === 'register') from = '/login'

  const navigation = useNavigate(); //not required.
  function goFrom(){ navigation(from, { replace: true }); }

  useEffect(
    () => {
      errRef.current ='';
      nameRef.current?.focus();
    }, []
  );

  return (
    
      <PopUp open={open} handleClose={handleClose} title="Register" handleSubmit={()=>{ registerButtonRef.current.click()}} submitText="Register" >
        <CssBaseline />
        <Box sx={{ marginTop: 1, display: 'flex', flexDirection: 'column', alignItems: 'center'}} >
            <Avatar sx={{ m: 1, bgcolor: 'primary.main', width: '70px ! important', height: '70px ! important'}}> <Icons.LockOutlined /> </Avatar>
            <Typography component="h1" variant="h5"> Sign up </Typography>

            <Box component="form" noValidate onSubmit={(e) => handleSubmit(e, setErrMsg, setAuth, goFrom, handleClose)} sx={{ mt: 3 }}>
              <TextField label="Name" autoFocus autoComplete="name" inputRef={nameRef} id="name" name="name" fullWidth />
              
              <TextField label={t('Email')} autoComplete="email" id="email" name="email" fullWidth/>
              
              <Box sx={{ alignItems: 'left', width: '100%'}}>
                <TextField label={t('Age')} type="number" id="age" name="age" sx={{width: '40%'}} />
              </Box>

              <TextField label={t('Password')} id="password" name="password" type="password" autoComplete="new-password" helperText="minimum 6 symbols" fullWidth />

                {/*
              <TextField label={t('Confirm password')} name="passwordConfirm" type="password" fullWidth />
                */}
                
              

              <Box sx={{ textAlign: 'center', width: '100%'}}>
                <Typography variant="body2" color="primary" ref={errRef}>|{errMsg}|</Typography>
                <Button ref={registerButtonRef} type="submit" variant="contained"> {t('Registration')} </Button>
              </Box>
          </Box>
        </Box>
      </PopUp>
    
  );
};

const handleSubmit = (event, setErrMsg, setAuth, goFrom, handleClose) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  console.log({ email: data.get('email'), password: data.get('password'), });
  const user = new User( 
    data.get('name')
    , data.get('email')
    , undefined
    , undefined
  );
  user.password =  data.get('password');
  new DatabaseRequest( () => userRegisterApi(user) )
    .GoodResult( async (result) => {
        const resultClone = JSON.parse(JSON.stringify(result));
       
        resultClone.password = data.get('password');
        setAuth(resultClone);
        handleClose();
        //goFrom();
      } )
    .BadResult( (error) => { setErrMsg(error); } )
    .Build();
};




