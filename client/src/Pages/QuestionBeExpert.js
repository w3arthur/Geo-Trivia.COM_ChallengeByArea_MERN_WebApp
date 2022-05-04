import React, {useRef, useState, useEffect} from 'react';
import {Box, Grid, Typography, Button,  Chip, Avatar } from "@mui/material";
import * as Icons from "@mui/icons-material/"; 

import { PopUp, Chart, Boom, Follow } from '../Components';
import { Axios, deepCopy, transmitter  } from '../Api';
import { DatabaseRequest } from '../Classes';
import { useAuth, useLoading } from '../Context';
import { useGoTo, useTranslation } from '../Hooks';

import { QuestionValue, Answer } from './Question';

const REGULAR_COLOR = '#FFFFFFAA';

export default function Question({mapSelectedCountry, openQuestion}){

    const { auth, setAuth } = useAuth();
    const { setAxiosLoading, setAlert } = useLoading();

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [playerData, setPlayerData] = useState();
    const [answers, setAnswers] = useState([]);

    //const goTo = useGoTo();// load this area by another way

    useEffect(() => {
        const areaId = mapSelectedCountry?._id;
        resetData();
        handleGetExpertQuestions(auth, setAuth, setPlayerData, areaId, setAxiosLoading, setAlert)
    }, [])


    function resetData(){
        setPlayerData();
        setCurrentQuestion(0);
        setAnswers([]);
    }

    return(<div>
        <QuestionValue > {playerData?.questions[currentQuestion].question} </QuestionValue>
       
        <Grid container>
            {playerData?.questions[currentQuestion].answers.map((ans, i) => (
                <Answer isFollow={false} numberBackgroundColor={REGULAR_COLOR} sx={{}} number={ i + 1 } onClick={(e) => {
                    setTimeout(() =>{e.target.parentNode.parentNode.blur();}, 500)
                    const answersClone = JSON.parse(JSON.stringify(answers));
                    const answer = i;
                    answersClone[currentQuestion] = answer;
                    if(playerData.questions.length === currentQuestion + 1){
                        handlePostExpertAnswers(setAuth, playerData, answersClone, setAxiosLoading, setAlert); 
                        resetData();
                        return;
                    }
                    setCurrentQuestion(currentQuestion + 1);
                    setAnswers(answersClone); 
                }}> {ans} </Answer>
            ) ) }
        </Grid>
        
    </div>);
}


function handleGetExpertQuestions(auth, setAuth, setPlayerData, areaId, setAxiosLoading, setAlert){
        const player = auth._id;
        const data = `area=${areaId}`;
        //lang goes from cookie
        new DatabaseRequest( () => Axios('GET', '/api/expert/qualify/' + player + '?' + data , {}, {}) )
        .GoodResult( (result) => {
            if(result.expert){
                setAuth(result);
                alert('you are expert, no questions for your area'); return;
            }
            setPlayerData(result);
        } )
        .BadResult( (error) => {
            setAlert(`error with getting expert questions ${error}`); 
        } )
        .Build(setAxiosLoading);
        //handle add as expert if no questions
}


const handlePostExpertAnswers = (setAuth, playerData, answers, setAxiosLoading, setAlert) => {
    const triviaId = playerData._id;
    alert(answers)
    const data =  {  triviaId: triviaId, answers: answers };
    new DatabaseRequest( () => Axios('POST', '/api/expert/qualify', data, {}) )
    .GoodResult( (result) => {
        if(result.expert){
            setAuth(result);
            alert('you are expert');
            return;
        }else {alert('fail to get expert');return;}
        } )
    .BadResult( (error) => { setAlert(error); } )
    .Build(setAxiosLoading);
    //handle add as expert if answered more then 70% of the questions
};

