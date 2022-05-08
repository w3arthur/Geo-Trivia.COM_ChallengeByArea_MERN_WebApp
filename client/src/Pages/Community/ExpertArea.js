/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, /*useRef, */useState} from 'react';
import { Box, Divider, Tabs, Tab,  Button, Typography } from "@mui/material";
import * as Icons from '@mui/icons-material';

import { DatabaseRequest } from '../../Classes';
import { useLoading } from '../../Context';
import { Axios } from '../../Api';
import { colors } from '../../Config';
import { TabPanel } from './Community';


export default function ExpertArea_VerticalTabs({auth, verticalValue, setVerticalValue}) {
  const {setAxiosLoading, setAlert} = useLoading();

  const areas = auth?.expertAreas;
  const [questions, setQuestions] = useState();
  const [expertQuestionsPage, setExpertQuestionsPage] = useState(1);
  const [expertQuestionsLastPage, setExpertQuestionsLastPage] = useState(false);

  useEffect(()=>{
    getExpertAreaQuestions(auth, areas[verticalValue], expertQuestionsPage, setExpertQuestionsLastPage, setQuestions, setAxiosLoading, setAlert, questions);
  }, [])

  const handleChange = (event, newValue) => { 
    setVerticalValue(newValue);
    setExpertQuestionsLastPage(false);
    setExpertQuestionsPage(1);
    getExpertAreaQuestions(auth, areas[newValue], 1, setExpertQuestionsLastPage, setQuestions, setAxiosLoading, setAlert, questions);
      };

return (
<Box sx={{ m:0, p:0,flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: '100%' }}>
  <Tabs sx={{ m:0, p:0,borderRight: 1, borderColor: 'divider' }} orientation="vertical" variant="scrollable" value={verticalValue} onChange={handleChange} aria-label="Vertical tabs example" >
    { areas?.map((x, i) =>  (<Tab label={x.area} {...a11yProps(i)} />)  ) }
  </Tabs>
  { areas?.map((x, i) =>  (<>
      {/*Expert Area */}
      <TabPanel  sx={{wordBreak: 'break-word'}} value={verticalValue} index={i}> 
      
      <Divider></Divider>
      <Box sx={{direction: 'ltr'}}>
          <Button startIcon={<Icons.ArrowBack />} onClick={() => {
              const page = expertQuestionsPage - 1;
              setExpertQuestionsPage(page);
              setExpertQuestionsLastPage(false);
              getExpertAreaQuestions(auth, areas[verticalValue], page, setExpertQuestionsLastPage, setQuestions, setAxiosLoading, setAlert, questions);
          }} disabled={expertQuestionsPage === 1 ? true : false} sx={{m: 1,}} variant="contained"> Back </Button>
          <Button endIcon={<Icons.ArrowForward />} onClick={() => {
              const page = expertQuestionsPage + 1;
              setExpertQuestionsPage(page);
              getExpertAreaQuestions(auth, areas[verticalValue], page, setExpertQuestionsLastPage, setQuestions, setAxiosLoading, setAlert, questions);
          }} disabled={expertQuestionsLastPage === true ? true : false} sx={{m: 1}} variant="contained"> Next </Button>
      </Box>

      {questions?.map((question) => (<>
        <Divider></Divider>
        <Box sx={{backgroundColor: colors.expertToApproveQuestions.questionTitle }}>
          <Typography variant="body1" component="div">{question.question}</Typography>
          <Divider></Divider>
        </Box>
        <Box>
        <Box sx={{ display: 'inline-block',  width: 'auto', textAlign: 'left'}}>
        {question.answers.map((answer, j) => (<Typography sx={question.rightAnswer === j ? ({fontWeight: 'bold'}) : ({})} variant="body1" component="div">{j + 1}) {answer}</Typography>) )}
        </Box>
        </Box>
        <Button onClick={() => { deleteQuestion(auth, question , areas[verticalValue], expertQuestionsPage, setExpertQuestionsLastPage, setQuestions, setAxiosLoading, setAlert); }} variant='contained'  sx={{m:1}}>Delete</Button> {/*size="small"*/}
        <Button onClick={() => { approveQuestion(auth, question , areas[verticalValue], expertQuestionsPage, setExpertQuestionsLastPage, setQuestions, setAxiosLoading, setAlert); }} startIcon={<Icons.CheckBox/>} variant='contained' sx={{m:1}}>Accept</Button>
        <Divider sx={{mb: 1}}></Divider>
        </>))} 
    </TabPanel>
  </>)  ) }
</Box>
); }


const approveQuestion =  (auth, question, area, page, setExpertQuestionsLastPage, setQuestions, setAxiosLoading, setAlert) => {
  const areaId= area._id;
  const questionId = question._id;
  setQuestions();
  const data = {areaId: areaId};
  new DatabaseRequest( () => Axios('PATCH', '/api/expert/' + questionId, data, {'authorization':  auth.accessToken}) )
  .GoodResult( (result) => {
      getExpertAreaQuestions(auth, area, page, setExpertQuestionsLastPage, setQuestions, setAxiosLoading, setAlert);
      } )
  .BadResult( (error) => {
      setAlert(error); 
      } )
  .Build(setAxiosLoading);
}


const deleteQuestion =  (auth, question, area, page, setExpertQuestionsLastPage, setQuestions, setAxiosLoading, setAlert) => {
  const areaId= area._id;
  const questionId = question._id;
  setQuestions();
  const data = `areaId=${areaId}`;
  new DatabaseRequest( () => Axios('Delete', '/api/expert/' + questionId + '?' + data, {}, {'authorization':  auth.accessToken}) )
  .GoodResult( (result) => {
      getExpertAreaQuestions(auth, area, page, setExpertQuestionsLastPage, setQuestions, setAxiosLoading, setAlert);
      } )
  .BadResult( (error) => {
      setAlert(error); 
      } )
  .Build(setAxiosLoading);
}


const getExpertAreaQuestions =  (auth, area, page, setExpertQuestionsLastPage, setQuestions, setAxiosLoading, setAlert) => {
  const areaId= area._id;
  setQuestions();
  const data = 'page=' + page;
  new DatabaseRequest( () => Axios('GET', '/api/expert/' + areaId + '?' + data, {}, {'authorization':  auth.accessToken}) )
  .GoodResult( (result) => {
      if(result.lastPage) setExpertQuestionsLastPage(true);
      setQuestions(result.questions);
      } )
  .BadResult( (error) => {
      setAlert(error); 
      } )
  .Build(setAxiosLoading);
}


const a11yProps = (index) => ({id: `vertical-tab-${index}`, 'aria-controls': `vertical-tabpanel-${index}`,});
