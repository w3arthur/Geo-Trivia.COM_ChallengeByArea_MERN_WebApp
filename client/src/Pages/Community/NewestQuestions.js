import React from 'react';
import {Grid, Box, Divider, Button } from "@mui/material";
import * as Icons from '@mui/icons-material';

import {  useLoading } from '../../Context';

import { QuestionValue, Answer } from '../Question';
import {getNewestQuestions} from './Community'

import { colors } from '../../Config'

export default function NewestQuestions({dataNewestQuestions}){
  const { setAxiosLoading, setAlert } = useLoading();
  const {newestQuestionsPage, setNewestQuestionsPage, newestQuestions, setNewestQuestions, newestQuestionsLastPage, setNewestQuestionsLastPage} = dataNewestQuestions;
  return (<>
  <Divider></Divider>
  <Box sx={{direction: 'ltr'}}>
        <Button startIcon={<Icons.ArrowBack />} onClick={() => {
            const page = newestQuestionsPage - 1;
            setNewestQuestionsPage(page);
            setNewestQuestionsLastPage(false);
            getNewestQuestions (page, setNewestQuestionsLastPage, setNewestQuestions, setAxiosLoading, setAlert);
        }} disabled={newestQuestionsPage === 1 ? true : false} sx={{m: 1,}} variant="contained"> Back </Button>
        <Button endIcon={<Icons.ArrowForward />} onClick={() => {
            const page = newestQuestionsPage + 1;
            setNewestQuestionsPage(page);
            getNewestQuestions (page, setNewestQuestionsLastPage, setNewestQuestions, setAxiosLoading, setAlert);
        }} disabled={newestQuestionsLastPage === true ? true : false} sx={{m: 1}} variant="contained"> Next </Button>
    </Box>
    <Divider></Divider>
    <Box  sx={{wordBreak: 'break-word'}}> 
      {
      newestQuestions?.map((question) => (<>
        <QuestionValue > {question.question} </QuestionValue>
        <Grid container>
            {question.answers.map((ans, i) => (
                <Answer isFollow={false} numberBackgroundColor={ colors.newestQuestions.numberBackgroundColor  } sx={question.rightAnswer === i ? {backgroundColor: colors.newestQuestions.rightAnswerBackgroundColor  } : {}} number={ i + 1 } onClick={(e) => {
                    e.target.parentNode.parentNode.blur();
                    e.target.preventDefault();
                }}> {ans} </Answer>
            ) ) }
        </Grid>
        <Divider></Divider>
        </>)  )
      }
    </Box>
  
  </>);
}


