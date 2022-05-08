import React from "react";

import { Toolbar, AppBar,  Button, Typography } from "@mui/material";
import * as Icons from '@mui/icons-material';
import { useGoTo, useTranslation } from '../Hooks';

export default function NavBar () {

    const { t } = useTranslation();
    const goTo = useGoTo();  
return(<>
 
<AppBar sx={{mt:15, mb:8}} position="static"  color="secondary">
  <Toolbar variant="dense">
    {/* <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}> <Icons.Menu /> </IconButton>*/}
    <Typography variant="h6" color="inherit" component="div"  > Geo-Trivia.com </Typography>
    <Typography  component="div" >
      <Button startIcon={<Icons.Grade />} onClick={() => goTo('/Community')} color="primary" variant="contained" size='small' sx={{ m:5, mb:{xs: 1,sm: 0}, mt:{xs: 2,sm: 0} }}>Community</Button>{" "}
      <Button startIcon={<Icons.Home />} onClick={() => goTo('/')} color="primary" variant="contained" size='small' sx={{ m:5, mb:{xs: 2,sm: 0}, mt:{xs: 1,sm: 0}}}>Home</Button>
    </Typography>
  </Toolbar>
</AppBar>


 </>);}