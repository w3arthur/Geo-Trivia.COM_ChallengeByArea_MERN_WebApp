import React from "react";
import { Link } from "react-router-dom";
import { Box, Button, Typography, TextField } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import GoogleIcon from "@mui/icons-material/Google";
import { useTranslation } from "react-i18next";

export default function Registration() {
  const { t } = useTranslation();
  return (
    <Box className="main">
      <Typography variant="h1" sx={{ fontWeight: "bold" }}>
        {t("Login with")}
      </Typography>
      <div className="left_side">
        <TextField
          id="standard-basic"
          label="Email"
          variant="outlined"
          className="reg_input"
          sx={{ mb: 2 }}
        />
        <TextField
          id="standard-basic"
          label="Password"
          variant="outlined"
          className="reg_input"
        />

        <Link className="button" to="/">
          Login
        </Link>
      </div>
      <div className="right_side">
        <Button
          className="sn_button"
          variant="contained"
          endIcon={<FacebookIcon />}
          sx={{ mb: 2 }}
        >
          Facebook
        </Button>
        <Button
          className="sn_button"
          variant="contained"
          endIcon={<GoogleIcon />}
        >
          Google
        </Button>
        <Link className="button" to="/">
          Registration
        </Link>
        <span></span>
      </div>
    </Box>
  );
}
