/* eslint-disable array-callback-return */
import React, { useState, useRef } from "react";
import { IconButton, Avatar, CircularProgress, Stack, Grid, TextField, Card, Chip , Paper, Link, Box, Button, Typography } from "@mui/material";
import * as Icons from "@mui/icons-material/"; 

import { PopUp, Map } from '../../Components';
import { Axios, deepCopy  } from '../../Api';
import { DatabaseRequest } from '../../Classes';
import { useAuth, usePlayingTeam } from '../../Context';
import { useGoTo, useTranslation } from '../../Hooks';
import { profile } from '../../Images';

import UserInvite from './UserInvite';
import User from './User';

export default function ChooseTeam(){
    const { t } = useTranslation();
    const { auth } = useAuth();
    const { playingTeam, setPlayingTeam } = usePlayingTeam();
    const [openPopup, setOpenPopup] = useState(false);
    const handleOpenPopup = () => {  handleCreateTeam(setOpenPopup, setPlayingTeam, auth); };

    const handleClose = () => {  setOpenPopup(false); };

    const [userArray, setUserArray] = useState([]);

return (<>
<Typography variant="h1" sx={{ fontWeight: "bold" }}> Choose Team </Typography>
{/* Yor Area is: ... */}
<Grid container>
    <Grid item xs={12} sm={6} sx={{p:2}}>
        <SelectionValue onClick={handleOpenPopup}>
            Invite <br /> Team <br/>
        <Box> <Icons.Groups sx={{mt: {xs: 3 ,sm: 5}, mb: 2, fontSize:{xs: '80pt' ,sm: '120pt'}}}/> </Box>
        </SelectionValue>
    </Grid>
    <Grid item xs={12} sm={6} sx={{p:2}}>
        <SelectionValue onClick={() => {}}>
        Play <br /> Single <br/>   
        <Box direction="row" sx={{ display:'flex', flexDirection: 'column', alignItems: 'center',}}>
            <Avatar src={profile} sx={{ backgroundColor: "#faae1c"
                , mt: {xs:5 , sm: 8} , mb: 4
                , width: {xs: '100px ! important', sm: '110px ! important'}
                , height: {xs: '100px ! important', sm: '110px ! important'}
                }} />
        </Box>
        </SelectionValue>
    </Grid>
</Grid>

<PopUp open={openPopup} handleClose={handleClose} title="Your Team"  
    handleSubmit={ () => {
        const array = []; 
        userArray.map( (x) => { x.accepted = true; array.push(x); } ); //delete
        setUserArray(array);
        if( userArray.filter((x) => x.accepted === false).length !== 0 ) return;
    } } submitText="Set Team">
  <Box sx={{minHeight: '300px'}}>

    <UserInvite playingTeam={playingTeam} setPlayingTeam={setPlayingTeam} userArray={userArray} setUserArray={ setUserArray } />
    
    { userArray.reverse().map((player)=>{ return (<User key={player._id} playingTeam={playingTeam} setPlayingTeam={setPlayingTeam} data={player} userArray={userArray} setUserArray={setUserArray}  />) }) }

  </Box>
</PopUp>
</>);
}


const handleCreateTeam = (setOpenPopup, setPlayingTeam, auth, setAuth, coordinates, setErrMsg) => {
  // language will send with the cookie
  const organizer = auth._id;
  const data =  { organizer };
  new DatabaseRequest( () => Axios('POST', '/api/playingTeam', data, {}) )
    .GoodResult( (result) => {
        setPlayingTeam(result);
        setOpenPopup(true);
      } )
    .BadResult( (error) => { alert(error); } )
    .Build();  
};

function SelectionValue({onClick, children, sx ,...props}){
    return(<>
        <Paper {...props} className="select"  onClick={ onClick } sx={{ height: { md: '55vh'} ,minHeight: {sm:'55vh', md: '300px'} ,...sx}} elevation={3}>
        <Typography variant="h2" color="secondary" sx={{mt: 8,fontSize:{xs:'28pt', md: '36pt'}}}>{children}</Typography>
        </Paper>
    </>);
}
