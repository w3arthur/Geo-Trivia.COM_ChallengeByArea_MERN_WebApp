import React from "react";

import { Toolbar, AppBar,  Button, Typography } from "@mui/material";
import * as Icons from '@mui/icons-material';
import { DatabaseRequest } from '../Classes';
import { useAuth, usePlayingTeam, useLoading } from '../Context';
import { useGoTo, useTranslation } from '../Hooks';
import { Axios } from '../Api';

export default function NavBar () {
    const { t } = useTranslation();
    const goTo = useGoTo();  
    const { setAuth } = useAuth();
    const { setPlayingTeam } = usePlayingTeam();
    const { setAxiosLoading, setAlert } = useLoading();

return(<>
<AppBar sx={{mt:15, mb:8}} position="static"  color="secondary">
  <Toolbar variant="dense">
    {/* <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}> <Icons.Menu /> </IconButton>*/}
    <Typography variant="h6" color="inherit" component="div"> {t("Geo-Trivia.com")} </Typography>
    <Typography  component="div" >
      <Button startIcon={<Icons.Grade />} onClick={() => goTo('/Community')} color="primary" variant="contained" size='small' sx={{ m:5, mb:{xs: 1,sm: 1}, mt:{xs: 2,sm: 1} }}>{t("Community")}</Button>
      <Button startIcon={<Icons.Home />} onClick={() => goTo('/')} color="primary" variant="contained" size='small' sx={{ m:5, mb:{xs: 2,sm: 1}, mt:{xs: 1,sm: 1}}}>{t("Go Home Page")}</Button>
      <Button startIcon={<Icons.ExitToApp />} onClick={() => handleSignOut(goTo, setAuth, setPlayingTeam, setAxiosLoading, setAlert)} color="primary" variant="contained" size='small' sx={{ m:5, mb:{xs: 2,sm: 1}, mt:{xs: 1,sm: 1}}}>{t("Logout")}</Button>
    </Typography>
  </Toolbar>
</AppBar>
 </>);}



const handleSignOut = ( goTo, setAuth, setPlayingTeam, setAxiosLoading, setAlert) => {
  new DatabaseRequest( () => Axios('DELETE', '/api/login', {} , {} ) )
    .GoodResult( () => { setAuth({}); setPlayingTeam({}); goTo("/"); } )
    .Build();  
};