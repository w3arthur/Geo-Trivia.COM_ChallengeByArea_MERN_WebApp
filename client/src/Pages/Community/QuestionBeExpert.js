import React, { useState, useEffect } from 'react';
import { Grid } from "@mui/material";

import { Axios  } from '../../Api';
import { DatabaseRequest } from '../../Classes';
import { useAuth, useLoading } from '../../Context';

import { QuestionValue, Answer } from '../Question';
import { colors } from '../../Config';

export default function QuestionBeExpert({mapSelectedCountry, openQuestion, setAlternativeContent}){
    const { auth, setAuth } = useAuth();
    const { setAxiosLoading, setAlert } = useLoading();

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [playerData, setPlayerData] = useState();
    const [answers, setAnswers] = useState([]);

    useEffect(() => {
        const areaId = mapSelectedCountry?._id;
        resetData();
        handleGetExpertQuestions(auth, setAuth, setPlayerData, areaId, setAxiosLoading, setAlert, setAlternativeContent)
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
        <Answer isFollow={false} numberBackgroundColor={ colors.questionBeExpert.numberBackgroundColor } sx={{}} number={ i + 1 } onClick={(e) => {
            setTimeout(() =>{e.target.parentNode.parentNode.blur();}, 500)
            const answersClone = JSON.parse(JSON.stringify(answers));
            const answer = i;
            answersClone[currentQuestion] = answer;
            if(playerData.questions.length === currentQuestion + 1){
                handlePostExpertAnswers(setAuth, playerData, answersClone, setAxiosLoading, setAlert, setAlternativeContent); 
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

function handleGetExpertQuestions(auth, setAuth, setPlayerData, areaId, setAxiosLoading, setAlert, setAlternativeContent){
    const player = auth._id;
    const data = `area=${areaId}`;
    //lang goes from cookie
    new DatabaseRequest( () => Axios('GET', '/api/expert/qualify/' + player + '?' + data , {}, {}) )
    .GoodResult( (result) => {
        if(result.expert){
            setAuth(result);
            setAlternativeContent('You are now expert!, no questions for your area'); return;
        }
        setPlayerData(result);
    } )
    .BadResult( (error) => {
        setAlert(`error with getting expert questions ${error}`); 
    } )
    .Build(setAxiosLoading);
    //handle add as expert if no questions
}


const handlePostExpertAnswers = (setAuth, playerData, answers, setAxiosLoading, setAlert, setAlternativeContent) => {
    const triviaId = playerData._id;
    alert(answers)
    const data =  {  triviaId: triviaId, answers: answers };
    new DatabaseRequest( () => Axios('POST', '/api/expert/qualify', data, {}) )
    .GoodResult( (result) => {
        if(result.expert){
            setAuth(result);
            setAlternativeContent('You are now expert!');
            return;
        }else {setAlternativeContent('Fail to get expert, answered less than 4/5 questions!');return;}
        } )
    .BadResult( (error) => { setAlert(error); } )
    .Build(setAxiosLoading);
    //handle add as expert if answered more then 70% of the questions
};

