/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Grid } from "@mui/material";

import { Axios  } from '../../api1';
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
        resetData();
        handleGetExpertQuestions();
    }, [])

    function resetData(){ setPlayerData(); setCurrentQuestion(0); setAnswers([]); }
const render = () =>(<div>
<QuestionValue > {playerData?.questions[currentQuestion].question} </QuestionValue>
<Grid container>
    {playerData?.questions[currentQuestion].answers.map((ans, i) => (
        <Answer isFollow={false} numberBackgroundColor={ colors.questionBeExpert.numberBackgroundColor } sx={{}} number={ i + 1 } onClick={(e) => {
            setTimeout(() =>{e.target.parentNode.parentNode.blur();}, 500)
            const answersClone = JSON.parse(JSON.stringify(answers));
            const answer = i; answersClone[currentQuestion] = answer;
            if(playerData.questions.length === currentQuestion + 1){
                handlePostExpertAnswers(); 
                resetData(); return;
                }
            setCurrentQuestion(currentQuestion + 1);
            setAnswers(answersClone); 
        }}> {ans} </Answer>
    ) ) }
</Grid>
</div>);


function handleGetExpertQuestions(){
    const areaId = mapSelectedCountry?._id;
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

const handlePostExpertAnswers = () => {
    const triviaId = playerData._id;
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


return render();}
