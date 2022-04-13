import React from "react";
import "./pop_reg.css";
import { Link } from "react-router-dom";
import { TextField } from "@mui/material";
import CancelIcon from '@mui/icons-material/Cancel';
import { useTranslation } from 'react-i18next';


const Pop_reg = ({ active, setActive }) => {

  const { t } = useTranslation()
  return (
    <div className={active ? "pop_reg active" : "pop_reg"}>
      <div className="pop_reg_content">
        <div className="pop_reg_close" onClick={() => setActive(false)}>
          <CancelIcon />
        </div>
        <TextField
          id="standard-basic"
          label={t('Email')}
          variant="outlined"
          className="reg_input"
          sx={{ mb: 2 }}
        />
        <TextField
          id="standard-basic"
          label={t('Age')}
          variant="outlined"
          className="reg_input"
          sx={{ mb: 2 }}
        />
        <TextField
          id="standard-basic"
          label={t('Password')}
          variant="outlined"
          className="reg_input"
          sx={{ mb: 2 }}
        />
        <TextField
          id="standard-basic"
          label={t('Confirm password')}
          variant="outlined"
          className="reg_input"
          sx={{ mb: 2 }}
        />

        <Link className="button" to="/">
          {t('Registration')}
        </Link>
      </div>
    </div>
  );
};

export default Pop_reg;
