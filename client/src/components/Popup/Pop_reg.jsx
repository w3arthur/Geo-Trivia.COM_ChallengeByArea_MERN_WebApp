import React from "react";
import "./pop_reg.css";
import { Link } from "react-router-dom";
import { TextField } from "@mui/material";
import CancelIcon from '@mui/icons-material/Cancel';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from "react";
import { useHttp } from "../hooks/http.hook";
import { useMessage } from '../hooks/message.hook';

const Pop_reg = ({ active, setActive }) => {
  const message = useMessage()
  const {loading, request, error, clearError} = useHttp()
  const [form, setForm] = useState({
    email: '', age: '', password: '', passwordConfirm: ''
  })

  useEffect(() => {
    
    message(error)
    clearError()
  },[error, message, clearError])

  const changeHandler = event => {
    setForm({...form, [event.target.name]: event.target.value})
  }

  const registerHandler = async () => {
    try {
      const data = await request('http://localhost:3500/api/auth/register', 'POST', {...form})
      message(data.messages)
    } catch (e){}
  }

  const { t } = useTranslation()
  return (
    <div className={active ? "pop_reg active" : "pop_reg"}>
      <div className="pop_reg_content">
        <div className="pop_reg_close" onClick={() => setActive(false)}>
          <CancelIcon />
        </div>
        <TextField
          id="standard-basic"
          name="email"
          label={t('Email')}
          variant="outlined"
          className="reg_input"
          sx={{ mb: 2 }}
          required
          onChange={changeHandler}
        />
        <TextField
          id="standard-basic"
          name="age"
          label={t('Age')}
          variant="outlined"
          className="reg_input"
          sx={{ mb: 2 }}
          onChange={changeHandler}
        />
        <TextField
          id="standard-basic"
          name="password"
          label={t('Password')}
          variant="outlined"
          className="reg_input"
          sx={{ mb: 2 }}
          required
          onChange={changeHandler}
        />
        <span className="musthave">minimum 6 symbols</span>
        <TextField
          id="standard-basic"
          name="passwordConfirm"
          label={t('Confirm password')}
          variant="outlined"
          className="reg_input"
          sx={{ mb: 2 }}
          required
          onChange={changeHandler}
        />

        <Link 
          className="button" to="/" 
          onClick={registerHandler}
          disabled={loading} >
          {t('Registration')}
        </Link>
      </div>
    </div>
  );
};

export default Pop_reg;
