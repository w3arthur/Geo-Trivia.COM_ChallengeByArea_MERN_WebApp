import React, { useState, useEffect, useRef } from "react";
import { Grid, Radio,  Typography, TextField, Button, Box, CssBaseline } from "@mui/material";

import { useAuth, useLoading } from '../../Context';
import { Axios } from '../../Api';
import { DatabaseRequest } from '../../Classes';
import { useTranslation } from '../../Hooks';

//import PropTypes from 'prop-types'; 
//import Location from '../Pages/Location';

export default function AddQuestionPopup({mapSelectedCountry, handleClose, /*openPopup, handleCloseAddQuestionPopup,*/ setAlternativeContent}){
  const { t } = useTranslation()
  const { setAxiosLoading, setAlert } = useLoading();
  const [setErrMsg] = useState(''); //to delete
  const yourQuestionRef = useRef( null );
  const addQuestionButtonRef = useRef( null );

  const { setAuth } = useAuth();
  const selectedAreaName = mapSelectedCountry?.area;
  const selectedAreaId = mapSelectedCountry?._id;

  useEffect(() => {
      yourQuestionRef.current?.focus();
    }, []);

  const [selectedValue, setSelectedValue] = useState(0);
  const handleChange = (event) => {
    setSelectedValue(Number(event.target.value));
  };

  const formRef = useRef();


  return (<>

{/*<PopUp open={openPopup} handleClose={handleCloseAddQuestionPopup} title="Add Question" handleSubmit={ () => { addQuestionButtonRef.current.click(); } } submitText="+Add Question">*/}
<CssBaseline />
<Box sx={{minHeight: '300px', marginTop: 1, display: 'flex', flexDirection: 'column', alignItems: 'center'}} >

    <Typography component="h1" variant="h5"> Add Question </Typography>

    <Box component="form" ref={formRef} noValidate onSubmit={(e) => handleSubmit(e, Axios, selectedAreaId, setErrMsg, setAuth, handleClose, setAxiosLoading, setAlert, setAlternativeContent)} sx={{ mt: 3 }}>
      
        <TextField label="The Question"  inputRef={yourQuestionRef} id="question" name="question" autoComplete={false} helperText="set your question" fullWidth />
        
        <Typography component="h5" variant="body"> Your Location: {" "} {selectedAreaName || "No Area!"} </Typography>
        
        <Grid container>

          <Answer i={0} selectedValue={selectedValue} handleChange={handleChange} />

          <Answer i={1} selectedValue={selectedValue} handleChange={handleChange} />

          <Answer i={2} selectedValue={selectedValue} handleChange={handleChange} />

          <Answer i={3} selectedValue={selectedValue} handleChange={handleChange} />

        </Grid>


        <Typography component="h5" variant="body"> Your Language: {t('Language')} </Typography>
      {/*the button accept submit, will not display */}
      <Box sx={{ textAlign: 'center', width: '100%'/*, display: 'none'*/}}>
        <Button ref={addQuestionButtonRef} type="submit" variant="contained"> + Add Question </Button>
      </Box>
  </Box>
</Box>
{/*</PopUp>*/}
</>);
};


function Answer({i ,selectedValue, handleChange}){
  return (<>
    <Grid item container xs={1}> <Radio checked={selectedValue === i} onChange={handleChange} value={i} name="rightAnswer" inputProps={{ 'aria-label': i }}/> </Grid>
    <Grid item xs={11} pl={1}> <TextField label={`Answer${i+1}`} id={`answer${i+1}`} name={`answer[${i}]`} autoComplete={false} fullWidth /> </Grid>
  </>)
}

const handleSubmit = (event, Axios, selectedAreaId, setErrMsg, setAuth, handleClose, setAxiosLoading, setAlert, setAlternativeContent) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);

  const area = selectedAreaId;
  const question = data.get('question');

  if(question.trim() === ''){setAlert('no question set');return;}

  const answers = [];
  let i = 0;
  while(data.get(`answer[${i}]`) !== null && i <= 20){
    const answer = data.get(`answer[${i}]`);
    if( answer.trim() === '' ){setAlert(`answer ${i+1} is empty`);return;}
    answers.push( answer );
    i++;
  }

  if(answers.length === 0) return;

  const rightAnswer = data.get('rightAnswer');

  const SendingQuestion = {
    question: question
    , answers: answers
    , location: area
    , rightAnswer: rightAnswer
  }
  
console.log('SendingQuestion', SendingQuestion)

  new DatabaseRequest( () => Axios('POST', '/api/question', SendingQuestion, {}) )
    .GoodResult( (result) => {
      setAlternativeContent(<>Thanks!<br /> Your Question is sent to area expert approval.</>);
      } )
    .BadResult( (error) => { setAlert(error); } )
    .Build(setAxiosLoading);  

};




