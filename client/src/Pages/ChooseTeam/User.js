
import React, { useState, useRef } from "react";
import { IconButton, Avatar, CircularProgress, Stack, Grid, TextField, Card, Chip , Paper, Link, Box, Button, Typography } from "@mui/material";
import * as Icons from "@mui/icons-material/"; 

import { useAuth, usePlayingTeam } from '../../Context';
import { profile } from '../../Images';
import { Axios, deepCopy  } from '../../Api';
import { DatabaseRequest } from '../../Classes';



export default function User({key, data, userArray, setUserArray}) {
    const border =  data.accepted ? '3px solid  #187071' : null;
    const {accepted} = data;
    const { auth, setAuth } = useAuth();
    const { playingTeam, setPlayingTeam } = usePlayingTeam();
return(<>
<Grid key={key} container sx={{mb: 1,pl: '3px', border: border, borderRadius: '5px'}}>
    <Grid item xs='1'> 
        <Avatar src={profile} sx={{ backgroundColor: "#faae1c" , mt: {xs: 0, sm: 3} , ml: {xs: '-3px', sm: 0}, width:  '32px ! important' , height: '32px ! important' }} />
    </Grid>
    
    <Grid item xs='8' sm='9' sx={{pl: '3px'}}>
         {/* <Typography variant="h4" sx={{textAlign: 'left', m:3}}>Email</Typography>  */}
        
        <TextField readOnly disabled value={data.email} fullWidth></TextField>

        </Grid>
    <Grid item xs={!accepted ? '1' : '2'}  sx={{zIndex: 1}}>
        <IconButton onClick={()=>{
                const email = data.email;
                const playerId = data._id;
                // const array = deepCopy(userArray).filter((x) => x.email !== data.email);
                // setUserArray(array);
                
                handleUserDelete(playingTeam, setPlayingTeam, auth, setAuth, playerId, setUserArray)
        }} sx={{mt: {xs: 5, sm: 3 }, ml: {xs: -2, sm: 0 }}}>
            <Icons.Close sx={{fontSize: '30pt'}} />
        </IconButton>
    </Grid>
    <Grid item xs='1' sm='1' sx={{display: {xs: 'none', sm: 'block'}}}>{ !data.accepted ? (<CircularProgress sx={{mt: 3}} size={34} />) : (<></>) }
    </Grid>
</Grid>
</>);
}


const handleUserDelete = (playingTeam, setPlayingTeam, auth, setAuth, playerId, setUserArray, setErrMsg, ) => {

    const playingTeamId = playingTeam._id;
    const playerIdData = playerId;
    new DatabaseRequest( () => Axios('DELETE', '/api/playingTeam/' +  playingTeamId + '?playerId=' + playerIdData , {}, {}) )
        .GoodResult( (result) => {
            console.log('aaaa444', auth)
            console.log('aaaa444res', result)
            const array = (result.players).filter((x) => x.email !== auth.email);
            
            setUserArray(array); 
        } )
        .BadResult( (error) => { alert(error); } )
        .Build();  
    };



