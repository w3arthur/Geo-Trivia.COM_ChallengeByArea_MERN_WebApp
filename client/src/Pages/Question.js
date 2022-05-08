/* eslint-disable array-callback-return */
import React, {useRef, useState, useEffect} from 'react';
import {Box, Grid, Typography, Button,  Chip, Avatar } from "@mui/material";
import * as Icons from "@mui/icons-material/"; 

import { PopUp, StatisticChart, Boom, Follow } from '../Components';
import { Axios, useReceiver, transmitter  } from '../Api';
import { DatabaseRequest } from '../Classes';
import { useAuth, usePlayingTeam, useLoading } from '../Context';
import { useGoTo } from '../Hooks';
import { colors } from '../Config'

const COLORS = colors.question.statisticNumbersColors;  //  ['#0088FEAA', '#00C49FAA', '#FFBB28AA', '#FF8042AA', '#FFBB28AA', '#00C49FAA']
const REGULAR_COLOR = colors.question.numberBackgroundColor;    //  '#FFFFFFAA'

export default function Question(){
    const { auth } = useAuth();
    const { setAxiosLoading, setAlert, setLoading } = useLoading();
    const { playingTeam, setPlayingTeam } = usePlayingTeam();

    const [question, setQuestion] = useState(-1);
    const [statisticShow, setStatisticShow] = useState(false);
    
    const [openFollowPopup, setOpenFollowPopup] = useState(false);
    const handleOpenFollowPopup = () => { setOpenFollowPopup(true); };
    const handleCloseFollowPopup = () => { setOpenFollowPopup(false); };
    const [openBoomPopup, setOpenBoomPopup] = useState(false);
    const handleOpenBoomPopup = () => { setOpenBoomPopup(true); };
    const handleCloseBoomPopup = () => { setOpenBoomPopup(false);goTo('/Location');setPlayingTeam({}); };        ///!!!!


    const goTo = useGoTo();


    const followerId = useRef(null);
    const followerAnswer = useRef(null);
    const [followerButtonShow, setFollowerButtonShow] = useState(true);

    useReceiver(playingTeam._id ,(x, error) => {
        if(error) { 
            setAlert('mistake');    //improve mistake
        }else if(x.followReturn && x.for === auth._id){
            followerAnswer.current = x.followedAnswer;
            setLoading(false);
            handleCloseFollowPopup();
            setFollowerButtonShow(false);
        }else if(x.follow && x.followId === auth._id){  
            followerId.current = x.followerId;
        }else if(x.unFollowOriginalFollower && x.for === auth._id){ //on boom
            setLoading(false);
            handleCloseFollowPopup();
            setFollowerButtonShow(false);
            //getQuestionTransmitter(playingTeam);
        }else if(x.finish){ 
            setLoading(false);
            handleGetPlayingTeam_renewData(auth, playingTeam, setPlayingTeam, setAxiosLoading, setAlert);
            goTo('/Results');
        }else if(x.getQuestion){ 
            //  if(x.currentQuestion !== playingTeam.currentQuestion) {}
                //stopLoader means that we moves to the next question.
            if( x.stopLoader ){ setLoading(false);}
            if( x.stopFollowerCheck ){ followerAnswer.current = null ;followerId.current = null; }
            if( followerId.current ){   //if you send answer, receive no new current question then use transmitter for right answer to follower
                const data = { follower: followerId.current, followed: auth._id, playingTeam: playingTeam._id }
                transmitter('followAnswerReturn', data);
             }
            setQuestion(x.currentQuestion);
        }//end if
    }, []);

    useEffect(() => {
        getQuestionTransmitter(playingTeam);    //? to delete if not needed
    }, [])
    
    const allPlayers = playingTeam.players;
    const yourPlayerData = allPlayers?.filter((player) =>  player._id === auth._id)
    const yourPlayer = yourPlayerData && yourPlayerData[0];
    const helpers = yourPlayer?.helpers;

    return(<div>
        <QuestionValue > {currentQuestion(question, playingTeam)?.question}</QuestionValue>
        <Grid container>
            {currentQuestion(question, playingTeam)?.answers.map((ans, i) => (
                <Answer isFollow={i===followerAnswer.current} numberBackgroundColor={statisticShow ? COLORS[i] : REGULAR_COLOR} sx={playingTeam.hideAnswers?.includes(i) ? {visibility: 'hidden', display: {xs: 'none', md: 'flex'} } : {visibility: 'visible', display: 'flex' }} number={ i + 1 } onClick={(e) => {
                    const answer = i;
                    handlePostAnswer({e, auth, playingTeam, setPlayingTeam, question: question, answer, setAxiosLoading, setAlert, setStatisticShow, setLoading});
                }}> {ans} </Answer>
            ) ) }
        </Grid>
        <Grid container sx={{width: '100%', display:  statisticShow ? 'flex' : 'none'}}>
            <Box sx={{ width: '100%'}}> <StatisticChart data={statisticData(question, playingTeam)} /> </Box>
        </Grid>
        <Grid sx={{mt:7, textAlign: 'center', width: '100%'}}>
            <Helper startIcon={<Icons.Battery50/>} onClick={() => {handle5050({auth, playingTeam, setPlayingTeam, question, setAxiosLoading, setAlert})}} sx={{display: helpers?.h5050? 'inline-block': 'none'}}>50/50</Helper>
            <Helper startIcon={<Icons.InsertChart/>} onClick={() => {handleStatistic({auth, playingTeam, setPlayingTeam, question, setAxiosLoading, setAlert, setStatisticShow})}} 
                sx={{display: !statisticShow && helpers?.statistic  ? 'inline-block': 'none'}}>Statistic</Helper>
            {allPlayers?.length > 1 && helpers?.follow && followerButtonShow && !followerAnswer.current ? (<Helper startIcon={<Icons.ImageSearch/>} onClick={() => { handleOpenFollowPopup() }} sx={{display: helpers?.follow? 'inline-block': 'none'}}>Follow</Helper>) : (<></>)}
        </Grid>
        <PopUp open={openFollowPopup} handleClose={handleCloseFollowPopup} title="Choose to Follow"><Follow handleFollow={handleFollow(auth, playingTeam,  setAxiosLoading, setAlert, setLoading, handleOpenBoomPopup, followerId.current)} /></PopUp>
        <PopUp open={openBoomPopup} handleClose={handleCloseBoomPopup} title="Boom!, you crashed with another follower, your score 0"  handleSubmit={handleCloseBoomPopup} submitText="Finish The Game"><Boom/></PopUp>
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

//({auth, playingTeam : playingTeamData, setPlayingTeam, question : questionNumber, setAxiosLoading, setAlert})
const handleFollow = (auth, playingTeam,  setAxiosLoading, setAlert, setLoading, handleOpenBoomPopup, followerId) => (followAuthId) => {
    const authId = auth._id;
    const followId = followAuthId;
    const playingTeamId = playingTeam._id;
    const data =  { player: authId, playingTeam: playingTeamId };

    if(followerId === followAuthId){ 
        const transmitterData = {
            follower: authId
            ,followed: followId //this user will un boom (on un boom report the follow sent as followed)
            ,playingTeam: playingTeamId
        }
        transmitter('boomHandler', transmitterData);

        setLoading(false);
        handleOpenBoomPopup();
        
        return;
    }

    new DatabaseRequest( () => Axios('PATCH', '/api/playingTeam/follow', data, {'authorization':  auth.accessToken}) )
        .GoodResult( (result) => {
            const transmitterData = {
                auth: authId
                ,followed: followId
                ,playingTeam: playingTeamId
            }
            transmitter('followQuestion', transmitterData);
            setLoading(true);
            } )
        .BadResult( (error) => { setAlert(error); } )
        .Build(setAxiosLoading);  
}


function handleGetPlayingTeam_renewData(auth, playingTeam, setPlayingTeam, setAxiosLoading, setAlert){
        const playingTeamId = playingTeam._id;
        new DatabaseRequest( () => Axios('GET', '/api/playingTeam/' + playingTeamId, {}, {'authorization':  auth.accessToken}) )
        .GoodResult( (result) => {
            setPlayingTeam(result);
        } )
        .BadResult( (error) => {
            setAlert(`no gaming team ${error}`); 
        } )
        .Build(setAxiosLoading);
}


const handle5050 = ({auth, playingTeam : playingTeamData, setPlayingTeam, question : questionNumber, setAxiosLoading, setAlert}) => {
  // language will send with the cookie
  const player = auth._id;
  const playingTeam = playingTeamData._id;
  const question = questionNumber;
  const data =  {  player,  playingTeam, question };
  new DatabaseRequest( () => Axios('PATCH', '/api/playingTeam/h5050', data, {'authorization':  auth.accessToken}) )
    .GoodResult( (result) => {
        //keep only 2 questions from all the page
        const playingTeamClone = JSON.parse(JSON.stringify(result));
        const questions = playingTeamClone.questions;
        const currentQuestion = questions[question];

        const currentAnswers = currentQuestion.answers;
        const currentAnswer = currentQuestion.rightAnswer;
        const hideAnswers = [];
        let c = currentAnswers.length - 2; // 2
        currentAnswers.map((ans, i) => { if(i !== currentAnswer && c > 0) { hideAnswers.push(i); c -- ; } });
        playingTeamClone.hideAnswers = hideAnswers;
        setPlayingTeam(playingTeamClone);
      } )
    .BadResult( (error) => { setAlert(error); } )
    .Build(setAxiosLoading);  
};

const handleStatistic = ({auth, playingTeam : playingTeamData, setPlayingTeam, question : questionNumber, setAxiosLoading, setAlert, setStatisticShow}) => {
    const player = auth._id;
    const playingTeam = playingTeamData._id;
    const question = questionNumber;
    const data =  {  player,  playingTeam, question };
    new DatabaseRequest( () => Axios('PATCH', '/api/playingTeam/statistic', data, {'authorization':  auth.accessToken}) )
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
    new DatabaseRequest( () => Axios('PATCH', '/api/playingTeam/answer', data, {'authorization':  auth.accessToken}) )
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


export function QuestionValue({ children, ref, sx, ...props}){
return(
    <Box  sx={{  minHeight:'20vh', width: '100%', display: 'flex', ...sx}}>
        <div ref={ref}></div>
        <Typography  {...props} variant="h4" > {children} </Typography>
    </Box>
    );
}

export function Answer({ isFollow , md, xs , numberBackgroundColor,onClick, children, number, sx ,...props}){
    const chipStyle = isFollow ? {borderColor: '#FFA500', borderWidth: 2} : {};
    const avatarStyle = isFollow ? { borderWidth: 5} : {};
    return(
        <Grid item container md={6} xs={12} sx={{p: 2, }} >
                <Chip {...props} sx={{...chipStyle ,...sx}} className="answer" onClick={onClick} component="div"
                    avatar={<Avatar sx={{...avatarStyle, bottom: "50%", left: "top",  backgroundColor: numberBackgroundColor}}><Typography sx={{}} component="div" className="answerNumber">{number}</Typography></Avatar>} 
                    label={<Typography variant="h5" component="div" className="answerValue" >{children}</Typography>} />         
        </Grid>
        );
}


