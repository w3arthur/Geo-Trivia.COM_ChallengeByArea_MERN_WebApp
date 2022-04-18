import React from "react";
import { Link } from "react-router-dom";
import { Box, Button, Typography, TextField } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import GoogleIcon from "@mui/icons-material/Google";
import { useTranslation } from "react-i18next";
import Pop_reg from "../Popup/Pop_reg";
import { useState } from "react";
import { useHttp } from "../hooks/http.hook";
import GoogleLogin from 'react-google-login';
import axios from 'axios';

export default function Registration() {
  const responseSuccessGoogle = (response) => {
    console.log(response)
    axios ({ 
      method: "POST",
      url: "http://localhost:3500/api/auth/google",
      data: {tokenId: response.tokenId}
    }).then(response => {
      console.log("Google login success", response)
    })
  }

  const responseErrorGoogle = (response) => {
    console.log(response)
  }

  const {loading, error, request} = useHttp()

  const [form, setForm] = useState({
    email: '', password: ''
  })

  const changeHandler = event => {
    setForm({...form, [event.target.name]: event.target.value})
  }

  const registerHandler = async () => {
    try {
      const data = await request('/api/auth/register', 'POST', {...form})
      console.log(data)
    } catch (e){}
  }

  const loginHandler = async () => {
    try {
      const data = await request('http://localhost:3500/api/auth/login', 'POST', {...form})
      console.log(data)
    } catch (e){}
  }

    const { t } = useTranslation()

  const [modalActive, setModalActive] = useState(false)

  return (
    <Box className="main">
      <Typography variant="h1" sx={{ fontWeight: "bold" }}>
        {t("Login with")}
      </Typography>
      <div className="left_side">
        <TextField
          id="standard-basic"
          name='email'
          label={t('Email')}
          variant="outlined"
          className="reg_input"
          sx={{ mb: 2 }}         
          required
          onChange={changeHandler}
        />
        <TextField
          id="standard-basic"
          name='password'
          label={t('Password')}
          variant="outlined"
          className="reg_input"          
          required
          onChange={changeHandler}
        />

        <Link 
          className="button" to="/Registration"
          onClick={loginHandler}
          >
          {t('Login')}
        </Link>
      </div>
      <div className="right_side">
        <Button
          href="http://localhost:3500/api/auth/facebook" 
          className="sn_button"
          variant="contained"
          endIcon={<FacebookIcon />}
          sx={{ mb: 2 }}
        >
          Facebook&nbsp;&nbsp;
        </Button>

        <GoogleLogin
          clientId="602070662525-cg5up3456lcbdngu7nhji2j6inpi8t1b.apps.googleusercontent.com"
          buttonText="Google"
          onSuccess={responseSuccessGoogle}
          onFailure={responseErrorGoogle}
          cookiePolicy={'single_host_origin'}
          />,

        {/* <Button
          className="sn_button"
          variant="contained"
          endIcon={<GoogleIcon />}
        >
          Google&nbsp;&nbsp;
        </Button> */}
        <div 
          className="button" 
          onClick={() => setModalActive(true)} to="/" 
          >
            {t('Registration')}
        </div>
        <Pop_reg active={modalActive} setActive={setModalActive} />
      </div>
    </Box>
  );
}
