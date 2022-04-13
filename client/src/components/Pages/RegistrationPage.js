import React from "react";
import { Link } from "react-router-dom";
import { Box, Button, Typography, TextField } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import GoogleIcon from "@mui/icons-material/Google";
import { useTranslation } from "react-i18next";
import Pop_reg from "../Popup/Pop_reg";
import { useState } from "react";

export default function Registration() {
  const { t } = useTranslation();
  const [modalActive, setModalActive] = useState(false);
  return (
    <Box className="main">
      <Typography variant="h1" sx={{ fontWeight: "bold" }}>
        {t("Login with")}
      </Typography>
      <div className="left_side">
        <TextField
          id="standard-basic"
          label={t('Email')}
          variant="outlined"
          className="reg_input"
          sx={{ mb: 2 }}
        />
        <TextField
          id="standard-basic"
          label={t('Password')}
          variant="outlined"
          className="reg_input"
        />

        <Link className="button" to="/Location">
          {t('Login')}
        </Link>
      </div>
      <div className="right_side">
        <Button
          className="sn_button"
          variant="contained"
          endIcon={<FacebookIcon />}
          sx={{ mb: 2 }}
        >
          Facebook&nbsp;&nbsp;
        </Button>
        <Button
          className="sn_button"
          variant="contained"
          endIcon={<GoogleIcon />}
        >
          Google&nbsp;&nbsp;
        </Button>
        <div className="button" onClick={() => setModalActive(true)} to="/">
          {t('Registration')}
        </div>
        <Pop_reg active={modalActive} setActive={setModalActive} />
      </div>
    </Box>
  );
}
