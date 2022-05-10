/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Grid } from "@mui/material";

import { Axios  } from '../../Api';
import { DatabaseRequest } from '../../Classes';
import { useAuth, useLoading } from '../../Context';
import { useTranslation } from '../../Hooks';
import { QuestionValue, Answer } from '../Question';
import { colors } from '../../Config';
import { congratulations } from '../../Images'

export default function QuestionBeExpert({mapSelectedCountry, openQuestion, setAlternativeContent}){
    const { t } = useTranslation();
    const { auth, setAuth } = useAuth();
    const { setAxiosLoading, setAlert } = useLoading();

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [playerData, setPlayerData] = useState();
    const [answers, setAnswers] = useState([]);

    useEffect(() => {
        const areaId = mapSelectedCountry?._id;
        resetData();
        handleGetExpertQuestions(auth, setAuth, setPlayerData, areaId, setAxiosLoading, setAlert, setAlternativeContent, t);
    }, [])

    function resetData(){ setPlayerData(); setCurrentQuestion(0); setAnswers([]); }
return(<div>
<QuestionValue > {playerData?.questions[currentQuestion].question} </QuestionValue>
<Grid container>
    {playerData?.questions[currentQuestion].answers.map((ans, i) => (
        <Answer isFollow={false} numberBackgroundColor={ colors.questionBeExpert.numberBackgroundColor } sx={{}} number={ i + 1 } onClick={(e) => {
            setTimeout(() =>{e.target.parentNode.parentNode.blur();}, 500)
            const answersClone = JSON.parse(JSON.stringify(answers));
            const answer = i; answersClone[currentQuestion] = answer;
            if(playerData.questions.length === currentQuestion + 1){
                handlePostExpertAnswers(auth, setAuth, playerData, answersClone, setAxiosLoading, setAlert, setAlternativeContent, t); 
                resetData(); return;
                }
            setCurrentQuestion(currentQuestion + 1);
            setAnswers(answersClone); 
        }}> {ans} </Answer>
    ) ) }
</Grid>
</div>);
}

function handleGetExpertQuestions(auth, setAuth, setPlayerData, areaId, setAxiosLoading, setAlert, setAlternativeContent, t){
    const player = auth._id;
    const data = `area=${areaId}`;
    //lang goes from cookie
    new DatabaseRequest( () => Axios('GET', '/api/expert/qualify/' + player + '?' + data , {}, {'authorization':  auth.accessToken}) )
    .GoodResult( (result) => {
        if(result.expert){ setAuth(result); setAlternativeContent(<>{t("You are now expert!, no questions for your area.")}<br />  <img src={congratulations} alt="congratulations!" style={{width:'400px',height:'auto'}} />  <br/> </>); return; }
        setPlayerData(result);
    } )
    .BadResult( (error) => { setAlert(`error with getting expert questions ${error}`); } )
    .Build(setAxiosLoading);
    //handle add as expert if no questions
}

const handlePostExpertAnswers = (auth, setAuth, playerData, answers, setAxiosLoading, setAlert, setAlternativeContent, t) => {
    const triviaId = playerData._id;
    alert(answers)
    const data =  {  triviaId: triviaId, answers: answers };
    new DatabaseRequest( () => Axios('POST', '/api/expert/qualify', data, {'authorization':  auth.accessToken}) )
    .GoodResult( (result) => {
        if(result.expert){ setAuth(result); setAlternativeContent(<> {t("You are now expert!")}<br />  <img src={congratulations} alt="congratulations!" style={{width:'400px',height:'auto'}} /> <br /></>); return;
        }else {setAlternativeContent( t("Fail to get expert") ); return;}
    } )
    .BadResult( (error) => { setAlert(error); } )
    .Build(setAxiosLoading);
    //handle add as expert if answered more then 70% of the questions
};
