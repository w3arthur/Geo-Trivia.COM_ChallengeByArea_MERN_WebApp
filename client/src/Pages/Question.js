import React, {useRef, useState, useEffect} from 'react';
import {Box, Grid, Typography, Button,  Chip, Avatar } from "@mui/material";


import { PopUp, } from '../Components';
import { Axios, deepCopy, useReceiver, receiver, transmitter  } from '../Api';
import { DatabaseRequest } from '../Classes';
import { useAuth, usePlayingTeam, useLoading } from '../Context';
import { useGoTo, useTranslation } from '../Hooks';




export default function Question(){
    const { auth } = useAuth();
    const { setAxiosLoading } = useLoading();
    const { playingTeam, setPlayingTeam } = usePlayingTeam();

    const [question, setQuestion] = useState(-1);
    const [answerSelected, setAnswerSelected] = useState(-1);
    
    useReceiver(playingTeam._id ,(x, error) => {
        if(error) {alert('mistake ');
        }else if(x.finish){
            alert('finish')
        }else if(x.follow){
        }else if(x.boom){
        }else if(x.getQuestion){
            
            setQuestion(x.currentQuestion);
            //setAnswer(-1);
            console.log('question', question);

        }//end if
    }, []);

    useEffect(() => {
        getQuestionTransmitter(playingTeam);
        alert(question)
        alert( JSON.stringify(playingTeam) )
    }, [])

    

    //const goTo = useGoTo();
    function currentQuestion(question){ //for development mode
        if (question === -1) {return undefined;}
        else if (!playingTeam.questions) {return undefined;}
        return playingTeam.questions[question];
    }

    return(<>
        <QuestionValue>{currentQuestion(question)?.question}</QuestionValue>
        
        <Grid container>
            {currentQuestion(question)?.answers.map((x, i) => (
                <Answer number={ i + 1 } onClick={() => {
                    const answer = i;
                    setAnswerSelected(answer); 
                    handlePostAnswer({auth, playingTeam, question: question, answer, setAxiosLoading, setAxiosLoading});
                
                }}> {x} </Answer>
            ) ) }
        </Grid>

        <Grid sx={{mt:7, textAlign: 'center', width: '100%'}}>
            <Helper onClick={() => {}}>50/50</Helper>
            <Helper onClick={() => {}}>Statistic</Helper>
            <Helper onClick={() => {}}>Follow</Helper>
        </Grid>
    </>);
}


const handlePostAnswer = ({auth, playingTeam : playingTeamData, question : questionValue, answer: answerValue, loader, setAxiosLoading}) => {
  // language will send with the cookie


  const player = auth._id;
  const playingTeam = playingTeamData._id;
  const question = questionValue;
  const answer = answerValue;
  const data =  {  player,  playingTeam, question, answer };
  new DatabaseRequest( () => Axios('PATCH', '/api/playingTeam/answer', data, {}) )
    .GoodResult( (result) => {
        getQuestionTransmitter(playingTeamData);
        alert('34343');
      } )
    .BadResult( (error) => { alert(error); } )
    .Build(setAxiosLoading);  
};


function getQuestionTransmitter(playingTeam){
    const data = {playingTeam: playingTeam};
    transmitter('getQuestion', data);
}

// function Submit({key, children ,...props}){
//     return(
//         <Button key={key} {...props} variant="contained" sx={{minHeight: 50, fontSize: 25}}>{children}</Button>
//         );
// }

function Helper({key, onClick, children, sx, ...props}){
    return(
        <Button {...props} onClick={onClick} variant="outlined" sx={{m: 2, minHeight: 50, fontSize: 25, ...sx}}>{children}</Button>
        );
}


function QuestionValue({ children, ...props}){
    return(
        <Box style={{  minHeight:'20vh', width: '100%', display: 'flex'}}>
            <Typography {...props} variant="h4" > {children} </Typography>
        </Box>
        );
}

function Answer({ md, xs ,onClick, children, number ,...props}){
    return(
        <Grid item container md={6} xs={12} sx={{p: 2}}  >
                <Chip {...props} sx={{}} className="answer" onClick={onClick} 
                    avatar={<Avatar sx={{ bottom: "50%", left: "top" }}><Typography component="div" className="answerNumber">{number}</Typography></Avatar>} 
                    label={<Typography variant="h5" component="div" className="answerValue" >{children}</Typography>} /> 
        </Grid>
        );
}


