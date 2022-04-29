import React, {useRef, useState, useEffect} from 'react';
import {Box, Grid, Typography, Button,  Chip, Avatar } from "@mui/material";


import { PopUp, } from '../Components';
import { Axios, deepCopy, useReceiver, receiver, transmitter  } from '../Api';
import { DatabaseRequest } from '../Classes';
import { useAuth, usePlayingTeam, useLoading } from '../Context';
import { useGoTo, useTranslation } from '../Hooks';




export default function Question(){
    const { auth } = useAuth();
    const { setAxiosLoading, setAlert } = useLoading();
    const { playingTeam, setPlayingTeam } = usePlayingTeam();

    const [question, setQuestion] = useState(-1);
    const [answerSelected, setAnswerSelected] = useState(-1);
    
    const goTo = useGoTo();

    useReceiver(playingTeam._id ,(x, error) => {
        if(error) {alert('mistake ');
        }else if(x.finish){ 
            goTo('/Results')
        }else if(x.follow){   
        }else if(x.boom){
                        //setAnswer(-1);
        }else if(x.getQuestion){ 
            setQuestion(x.currentQuestion);
        }//end if
    }, []);

    useEffect(() => {
        getQuestionTransmitter(playingTeam);
    }, [])
    
    //const goTo = useGoTo();
    function currentQuestion(question){ //for development mode
        if (question === -1) {return undefined;}
        else if (!playingTeam.questions) {return undefined;}
        return playingTeam.questions[question];
    }

    return(<div>
        <QuestionValue >{currentQuestion(question)?.question}</QuestionValue>
        <div  ></div>
        <Grid container>
            {currentQuestion(question)?.answers.map((x, i) => (
                <Answer number={ i + 1 } onClick={(e) => {
                    const answer = i;
                    setAnswerSelected(answer); 
                    handlePostAnswer({e, auth, playingTeam, setPlayingTeam, question: question, answer, setAxiosLoading, setAlert});
                }}> {x} </Answer>
            ) ) }
        </Grid>

        <Grid sx={{mt:7, textAlign: 'center', width: '100%'}}>
            <Helper onClick={() => {}}>50/50</Helper>
            <Helper onClick={() => {}}>Statistic</Helper>
            <Helper onClick={() => {}}>Follow</Helper>
        </Grid>
    </div>);
}


const handlePostAnswer = ({e, auth, playingTeam : playingTeamData, setPlayingTeam, question : questionValue, answer: answerValue, loader, setAxiosLoading, setAlert}) => {
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


function QuestionValue({ children, ref, ...props}){
    return(
        <Box  style={{  minHeight:'20vh', width: '100%', display: 'flex'}}>
            <div ref={ref}></div>
            <Typography  {...props} variant="h4" > {children} </Typography>
        </Box>
        );
}

function Answer({ md, xs ,onClick, children, number ,...props}){
    return(
        <Grid item container md={6} xs={12} sx={{p: 2}}  >
                <Chip {...props} sx={{}} className="answer" onClick={onClick} component="div"
                    avatar={<Avatar sx={{ bottom: "50%", left: "top" }}><Typography component="div" className="answerNumber">{number}</Typography></Avatar>} 
                    label={<Typography variant="h5" component="div" className="answerValue" >{children}</Typography>} /> 
        </Grid>
        );
}


