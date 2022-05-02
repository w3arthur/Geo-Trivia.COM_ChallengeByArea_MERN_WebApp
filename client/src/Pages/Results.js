/* eslint-disable array-callback-return */

import React, { useState, useRef, useEffect } from "react";
import { IconButton, Avatar, CircularProgress, Stack, Grid, TextField, Card, Chip , Paper, Link, Box, Button, Typography, Container } from "@mui/material";
import * as Icons from '@mui/icons-material';

import { PopUp, } from '../Components';
import { Axios, deepCopy, useReceiver, receiver, transmitter  } from '../Api';
import { DatabaseRequest } from '../Classes';
import { useAuth, usePlayingTeam, useLoading } from '../Context';
import { useGoTo, useTranslation } from '../Hooks';
import { profile } from '../Images';
import { BreakfastDiningOutlined } from "@mui/icons-material";


export default function Results(){
    const { t } = useTranslation();
    const { auth } = useAuth();
    const { playingTeam } = usePlayingTeam();
    const goTo = useGoTo();

    function getResults(){
        if(!auth || !playingTeam || !auth._id || playingTeam.id) return;
        const userId = auth._id
        const { players } = playingTeam;
        console.log('playingTeam', playingTeam)
        let yourPlayer = [];
        const otherPlayers = players.filter( x =>{ 
            if(x._id !== userId) return x;
            else {yourPlayer.push(x) }
            } );
        console.log(otherPlayers)
        const allPlayers = [...yourPlayer, ...otherPlayers];
        return allPlayers;
    }
const questionsTotal = playingTeam?.questions?.length;
return (<> <Grid container sx={{minHeight: 400}}>
    <Grid item xs={12} md={9} ><Typography variant="h1" color="secondary" sx={{ fontWeight: "bold" }}> Results </Typography></Grid>
    <Grid item container xs={12} md={3} ></Grid>

    <Grid item xs={12} md={9}>
        <Container  maxWidth="md">
            {
                getResults()?.map( (player, i) => {
                    let counter = 0;
                    player.answers.map( (x, i) => { if(x.answer === playingTeam.questions[i].rightAnswer) counter ++;});
                return( <Result you={i === 0 ? true : false} email={player.email} score={counter} questionsAnswered = {counter} questionsTotal = {questionsTotal} /> );
                })
            }
            <Button startIcon={<Icons.ArrowBack/>} variant="contained" onClick={() => {goTo('/Location')}} sx={{m:4}}>Back to Location Select</Button>
        </Container>
    </Grid>
    <Grid item container xs={12} md={3}  sx={{verticalAlign:'middle', minHeight: '300px', backgroundColor:'lightGray',  borderRadius: '10px'}}>
        <Box  sx={{ margin: 'auto' }} color="black">Advertisement</Box>
    </Grid>
</Grid></>)
}

function Result({email, score, questionsAnswered, questionsTotal, you}){
    const addSize = you ? 3 :0;
    return (<><Box ml={you? -1: 0} >
<Typography variant="h5" className="aaa" component="div" color="secondary" sx={{  fontSize: {xs: '14pt', sm: '16pt', md: '18pt', lg: '20pt'}, fontWeight: you ? "900 !" : "500"}}>
    <Grid item container xs={12}  m={{xs:0, sm:2}} mt={{xs:1, sm:2}} >
        <Grid item xs={2} lg="1" >
            <Avatar src={profile} sx={{ backgroundColor: "#faae1c"
                , width: {xs: `${35 + addSize  }px ! important`, sm: `${50 + addSize*2}px ! important`, md: `${70 + addSize*2.5}px ! important`}
                , height: {xs: `${35 + addSize }px ! important`, sm: `${50 + addSize*2}px ! important`, md: `${70 + addSize*2.5}px ! important`}
                }} />
        </Grid>
        <Grid item container xs={10} lg={11} > 
            <Grid item  xs={12} sm={8} sx={{wordBreak: 'break-all', textDecoration: 'underline'}}> {email} </Grid>
            <Grid item  xs={12} sm={4} > Score {score}pt </Grid>
            <Grid item  xs={12} sm={8} > Right answers </Grid>
            <Grid item  xs={12} sm={4} > {questionsAnswered}/{questionsTotal} Question </Grid>
        </Grid>
    </Grid>
</Typography>
</Box></>)
}