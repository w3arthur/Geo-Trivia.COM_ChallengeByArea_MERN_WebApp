import React from "react";
import LanguageFlags from "./multilanguage/LanguageFlags";
import { useTranslation } from "../Hooks"
import '../Styles/logo.css';


import {Toolbar, AppBar,  Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from "@mui/material";
import { styled } from '@mui/material/styles';
import * as Icons from '@mui/icons-material';

import { Outlet } from "react-router-dom";

export default function Logo () {

 const { t } = useTranslation();

 return(<>










  <div className="logo">
      <LanguageFlags />
 </div>

<Outlet/>
 

<br /><br />

<AppBar position="static">
  <Toolbar variant="dense">
    <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
      <Icons.Menu />
    </IconButton>
    <Typography variant="h6" color="inherit" component="div">
      Geo-Trivia.com
    </Typography>
  </Toolbar>
</AppBar>
<br />
<br />


 </>);}