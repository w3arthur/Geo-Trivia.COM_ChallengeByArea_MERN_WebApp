/* eslint-disable array-callback-return */

import React/*, { useState, useRef, useEffect }*/ from "react";
import { Avatar, Grid,  Box, Button, Typography, Container } from "@mui/material";
import * as Icons from '@mui/icons-material';

import { useAuth, usePlayingTeam } from '../Context';
import { useGoTo, useTranslation } from '../Hooks';
import { profile } from '../Images';
import { colors, sizes } from '../Config';

export default function Results(){
    const { t } = useTranslation();
    const { auth } = useAuth();
    const { playingTeam } = usePlayingTeam();
    const goTo = useGoTo();

    function getResults(){
        if(!auth || !playingTeam || !auth._id || playingTeam.id) return;
        const userId = auth._id;
        const { players } = playingTeam;
        let yourPlayer = [];
        const otherPlayers = players.filter( x =>{ if(x._id !== userId){return x;}else {yourPlayer.push(x);} } );
        const allPlayers = [...yourPlayer, ...otherPlayers];
        return allPlayers;  //yourPlayer is the first returned!
    }
const questionsTotal = playingTeam?.questions?.length;
const render = () => (<> <Grid container sx={{minHeight: 400}}>
    <Grid item xs={12} md={9} ><Typography variant="h1" color="secondary" sx={{ fontWeight: "bold" }}> {t('Game Results')} </Typography></Grid>
    <Grid item container xs={12} md={3} ></Grid>
    <Grid item xs={12} md={9}>
        <Container  maxWidth="md">
            {getResults()?.map( (player, i) => {
                let counter = 0;
                player.answers.map( (x, i) => { if(x.answer === playingTeam.questions[i].rightAnswer) counter ++;});
                return( <Result isYou={i === 0 ? true : false} email={player.email} score={counter} questionsAnswered = {counter} questionsTotal = {questionsTotal} /> );
                }   )   }
            <Button startIcon={<Icons.ArrowBack/>} variant="contained" onClick={() => {goTo('/Location')}} sx={{m:4}}> {t('Back to Location Screen')} </Button>
        </Container>
    </Grid>
    <Grid item container xs={12} md={3} sx={{verticalAlign:'middle', minHeight: '300px', backgroundColor:'lightGray', borderRadius: '10px'}}>
        <Box  sx={{ margin: 'auto' }} color={colors.advertisement.textColor}> {t('Advertisement')} </Box>
    </Grid>
</Grid></>)
return render();}


function Result({email, score, questionsAnswered, questionsTotal, isYou}){
    const { t } = useTranslation();
    const addSize = isYou ? 3 :0; //add size for your player
return (<><Box ml={isYou? -1: 0} >
<Typography variant="h5" component="div" color="secondary" sx={{ fontSize: sizes.resultsScreen , fontWeight: isYou ? "900 !" : "500"}}>
    <Grid item container xs={12}  m={{xs:0, sm:2}} mt={{xs:1, sm:2}} >
        <Grid item xs={2} lg="1" >
            <Avatar src={profile} sx={{ backgroundColor: "#faae1c"
                , width: {xs: `${35 + addSize }px ! important`, sm: `${50 + addSize*2}px ! important`, md: `${70 + addSize*2.5}px ! important`}
                , height: {xs: `${35 + addSize }px ! important`, sm: `${50 + addSize*2}px ! important`, md: `${70 + addSize*2.5}px ! important`}
                }} />
        </Grid>
        <Grid item container xs={10} lg={11} > 
            <Grid item  xs={12} sm={8} sx={{wordBreak: 'break-all', textDecoration: 'underline'}}> {email} </Grid>
            <Grid item  xs={12} sm={4} > {t("Score")} {" "} {score}{t("pt")}</Grid>
            <Grid item  xs={12} sm={8} > {t("Right answers")} </Grid>
            <Grid item  xs={12} sm={4} > {questionsAnswered}/{questionsTotal} {t("Questions Answered")} </Grid>
        </Grid>
    </Grid>
</Typography>
</Box></>);
}