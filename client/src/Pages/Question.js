/* eslint-disable array-callback-return */
import React, {useRef, useState, useEffect} from 'react';
import {Box, Grid, Typography, Button,  Chip, Avatar } from "@mui/material";

import { PopUp, Chart } from '../Components';
import { Axios, deepCopy, useReceiver, receiver, transmitter  } from '../Api';
import { DatabaseRequest } from '../Classes';
import { useAuth, usePlayingTeam, useLoading } from '../Context';
import { useGoTo, useTranslation } from '../Hooks';

const COLORS = ['#0088FEAA', '#00C49FAA', '#FFBB28AA', '#FF8042AA', '#FFBB28AA', '#00C49FAA'];
const REGULAR_COLOR = '#FFFFFFAA';

export default function Question(){
    const { auth } = useAuth();
    const { setAxiosLoading, setAlert, setLoading } = useLoading();
    const { playingTeam, setPlayingTeam } = usePlayingTeam();

    const [question, setQuestion] = useState(-1);
    const [statisticShow, setStatisticShow] = useState(false);
    
    const goTo = useGoTo();

    useReceiver(playingTeam._id ,(x, error) => {
        if(error) { setAlert('mistake ');
        }else if(x.finish){ 
            setLoading(false);
            goTo('/Results');
        }else if(x.follow){   
        }else if(x.boom){
                        //setAnswer(-1);
        }else if(x.getQuestion){ 
          //  if(x.currentQuestion !== playingTeam.currentQuestion) {}
            if(x.stopLoader)setLoading(false);
            setQuestion(x.currentQuestion);
        }//end if
    }, []);

    useEffect(() => {
        getQuestionTransmitter(playingTeam);
    }, [])
    
    //const goTo = useGoTo();

    const allPlayers = playingTeam.players;
    const yourPlayerData = allPlayers?.filter((player) =>  player._id === auth._id)
    const yourPlayer = yourPlayerData && yourPlayerData[0];
    const helpers = yourPlayer?.helpers;

    return(<div>
        <QuestionValue > {currentQuestion(question, playingTeam)?.question}</QuestionValue>
        <Grid container>
            {currentQuestion(question, playingTeam)?.answers.map((ans, i) => (
                <Answer numberBackgroundColor={statisticShow ? COLORS[i] : REGULAR_COLOR} sx={playingTeam.hideAnswers && playingTeam.hideAnswers[i]? {visibility: 'hidden', display: {xs: 'none', md: 'flex'} } : {visibility: 'visible', display: 'flex' }} number={ i + 1 } onClick={(e) => {
                    const answer = i;
                    handlePostAnswer({e, auth, playingTeam, setPlayingTeam, question: question, answer, setAxiosLoading, setAlert, setStatisticShow, setLoading});
                }}> {ans} </Answer>
            ) ) }
        </Grid>
        <Grid container sx={{width: '100%', display:  statisticShow ? 'flex' : 'none'}}>
            <Box sx={{ width: '100%'}}> <Chart data={statisticData(question, playingTeam)} /> </Box>
        </Grid>
        <Grid sx={{mt:7, textAlign: 'center', width: '100%'}}>
            <Helper onClick={() => {handle5050({auth, playingTeam, setPlayingTeam, question, setAxiosLoading, setAlert})}} sx={{display: helpers?.h5050? 'inline-block': 'none'}}>50/50</Helper>
            <Helper onClick={() => {handleStatistic({auth, playingTeam, setPlayingTeam, question, setAxiosLoading, setAlert, setStatisticShow})}} 
                sx={{display: !statisticShow && helpers?.statistic  ? 'inline-block': 'none'}}>Statistic</Helper>
            <Helper onClick={() => {}} sx={{display: helpers?.follow? 'inline-block': 'none'}}>Follow</Helper>
        </Grid>
        {console.log('helpers?.statistic ' ,helpers?.statistic)}
        {console.log('statisticShow ' ,statisticShow)}
    </div>);
}

function currentQuestion(question, playingTeam){ //for development mode
    if (question === -1) {return undefined;}
    else if (!playingTeam.questions) {return undefined;}
    return playingTeam.questions[question];
}

function statisticData(question, playingTeam){
    const q = currentQuestion(question, playingTeam)?.statistic.filter((x) => x.answer !== -1);
    function compare( a, b ) {  if ( a.answer < b.answer ) return -1; if ( a.answer > b.answer ) return 1; return 0; }    //check how sorting works if one answer is missing
    return q?.sort( compare ) || q;
}

const handle5050 = ({auth, playingTeam : playingTeamData, setPlayingTeam, question : questionValue, setAxiosLoading, setAlert}) => {
  // language will send with the cookie
  const player = auth._id;
  const playingTeam = playingTeamData._id;
  const question = questionValue;
  const data =  {  player,  playingTeam, question };
  new DatabaseRequest( () => Axios('PATCH', '/api/playingTeam/h5050', data, {}) )
    .GoodResult( (result) => {
        //keep only 2 questions from all the page
        const playingTeamClone = JSON.parse(JSON.stringify(result));
        const questions = playingTeamClone.questions;
        const currentQuestion = questions[result.currentQuestion];
        const currentAnswers = currentQuestion.answers;
        const currentAnswer = currentQuestion.rightAnswer;
        const hideAnswers = [];
        let c = currentAnswers.length - 2; // 2
        currentAnswers.map((ans, i) => { if(ans !== currentAnswer && c >= 0) { hideAnswers.push(i); c -- ; } });
        playingTeamClone.hideAnswers = hideAnswers;
        setPlayingTeam(playingTeamClone);
      } )
    .BadResult( (error) => { setAlert(error); } )
    .Build(setAxiosLoading);  
};

const handleStatistic = ({auth, playingTeam : playingTeamData, setPlayingTeam, question : questionValue, setAxiosLoading, setAlert, setStatisticShow}) => {
   // if(statisticData(question, playingTeam) === []){setAlert('No statistic for this question'); return;}
    const player = auth._id;
    const playingTeam = playingTeamData._id;
    const question = questionValue;
    const data =  {  player,  playingTeam, question };
    new DatabaseRequest( () => Axios('PATCH', '/api/playingTeam/statistic', data, {}) )
        .GoodResult( (result) => {
            setStatisticShow(true);
            } )
        .BadResult( (error) => { setAlert(error); } )
        .Build(setAxiosLoading);  
};

const handlePostAnswer = ({e, auth, playingTeam : playingTeamData, setPlayingTeam, question : questionValue, answer: answerValue, setAxiosLoading, setAlert, setStatisticShow, setLoading}) => {
    setStatisticShow(false); // set statistic to false (cancel it on the next question)
    setLoading(true);
    // language will send with the cookie
    const player = auth._id;
    const playingTeam = playingTeamData._id;
    const question = questionValue;
    const answer = answerValue;
    const data =  {  player,  playingTeam, question, answer };
    new DatabaseRequest( () => Axios('PATCH', '/api/playingTeam/answer', data, {}) )
        .GoodResult( (result) => {
            setPlayingTeam(result);
            getQuestionTransmitter(playingTeamData);
            setTimeout(() =>{e.target.parentNode.parentNode.blur();}, 500)
            } )
        .BadResult( (error) => { setAlert(error); } )
        .Build(setAxiosLoading);  
};


function getQuestionTransmitter(playingTeam){
    const data = {playingTeam: playingTeam};
    transmitter('getQuestion', data);
}


function Helper({key, onClick, children, sx, ...props}){
return(
    <Button {...props} onClick={onClick} variant="outlined" sx={{m: 2, minHeight: 50, fontSize: 25, ...sx}}>{children}</Button>
    );
}


function QuestionValue({ children, ref, sx, ...props}){
return(
    <Box  sx={{  minHeight:'20vh', width: '100%', display: 'flex', ...sx}}>
        <div ref={ref}></div>
        <Typography  {...props} variant="h4" > {children} </Typography>
    </Box>
    );
}

function Answer({ md, xs , numberBackgroundColor,onClick, children, number, sx ,...props}){
    return(
        <Grid item container md={6} xs={12} sx={{p: 2}}  >
                <Chip {...props} sx={{...sx}} className="answer" onClick={onClick} component="div"
                    avatar={<Avatar sx={{ bottom: "50%", left: "top",  backgroundColor: numberBackgroundColor}}><Typography sx={{}} component="div" className="answerNumber">{number}</Typography></Avatar>} 
                    label={<Typography variant="h5" component="div" className="answerValue" >{children}</Typography>} /> 
        </Grid>
        );
}


