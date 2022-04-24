import React from "react";
import { Avatar, Stack, Grid, Card, Chip , Paper, Link, Box, Button, Typography } from "@mui/material";
import * as Icons from "@mui/icons-material/";  //Facebook, Google

import { PopUp, Map } from '../Components';
import { Axios,  } from '../Api';
import { DatabaseRequest } from '../Classes';
import { useAuth } from '../Context';
import { useGoTo, useTranslation } from '../Hooks';
import { profile } from '../Images';


export default function ChooseTeam(){
    const { t } = useTranslation();

return (<>
    <Typography variant="h1" sx={{ fontWeight: "bold" }}> Choose Team </Typography>
    <Grid container>
        <Grid item xs={12} sm={6} sx={{p:2}}>
            <SelectionValue onClick={{}}>
                Invite <br /> Team <br/>
            <Box> <Icons.Groups sx={{mt: {xs: 3 ,sm: 5}, mb: 2, fontSize:{xs: '80pt' ,sm: '120pt'}}}/> </Box>
            </SelectionValue>
        </Grid>

        <Grid item xs={12} sm={6} sx={{p:2}}>
          <SelectionValue onClick={{}}>
            Play <br /> Single <br/>   
            <Box direction="row" sx={{ display:'flex', flexDirection: 'column', alignItems: 'center',}}>
                <Avatar src={profile} sx={{ backgroundColor: "#faae1c"
                    , mt: {xs:5 , sm: 8} , mb: 2
                    , width: {xs: '100px ! important', sm: '110px ! important'}
                    , height: {xs: '100px ! important', sm: '110px ! important'}
                    }} />
            </Box>
          </SelectionValue>
        </Grid>
{/*
    <Selection onClick={handleClick_openFromListPopup} leftMonkey>Choose Location <br /> from list</Selection>

    <Selection onClick={handleClick_openFromMapPopup} rightMonkey>Choose Location <br /> from map</Selection>

    <Selection onClick={handleClick_yourLocationPopup} leftBottomMonkey>Your <br /> Location</Selection>
 */}
    </Grid>



</>);

}



function SelectionValue({onClick, children, sx ,...props}){
    return(<>
        <Paper {...props} className="select"  onClick={ onClick } sx={{ height: { md: '55vh'} ,minHeight: {sm:'55vh', md: '300px'} ,...sx}} elevation={3}>
        <Typography variant="h2" color="secondary" sx={{mt: 8,fontSize:{xs:'28pt', md: '36pt'}}}>{children}</Typography>
        </Paper>
    </>);
}
