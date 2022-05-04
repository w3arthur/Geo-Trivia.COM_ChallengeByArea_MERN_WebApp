import React, {useEffect, useRef, useState} from 'react';
import {Grid, Box, Divider, Tabs, Tab, Toolbar, AppBar,  Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Typography, unstable_useId } from "@mui/material";
import { styled } from '@mui/material/styles';
import * as Icons from '@mui/icons-material';

import { PopUp, Map } from '../Components';

import { DatabaseRequest } from '../Classes';
import { useAuth, usePlayingTeam, useLoading } from '../Context';
import { useGoTo, useTranslation } from '../Hooks';
import { monkeyLeft, monkeyRight, globe } from '../Images'
import { Axios, useReceiver, receiver, transmitter  } from '../Api';

import AddQuestionPopup from '../Components/AddQuestion'
import Question from './Question';

import QuestionBeExpert from "./QuestionBeExpert";
import { QuestionValue, Answer } from './Question';

const geoData =  [ { _id:"0", location:{ coordinates: [35, 32] }, country: "Error", area:  "Error Point" } ];

export default function Community(){
    const { t } = useTranslation();
    const { auth , setAuth } = useAuth();
    const {setLoading, setAxiosLoading, setAlert} = useLoading();
    const geoDataRef = useRef(geoData);

    
    const [openPopup, setOpenPopup] = useState(false);
    const handleCloseAddQuestionPopup = () => {  setOpenPopup(false); };
    const handleOpenAddQuestionPopup = () => { if(!mapSelectedCountry || !mapSelectedCountry?.area){setAlert('no selected area');return;} setOpenPopup(true); };

    const [openFromMapPopup_AddQuestion, setOpenFromMapPopup_AddQuestion] = useState(false);
    const handleCloseMapPopup_AddQuestion = () => { setOpenFromMapPopup_AddQuestion(false); };
    const handleClick_openFromMapPopup_AddQuestion = () => { setOpenFromMapPopup_AddQuestion(true); };
    
    const [openFromMapPopup_BeExpert, setOpenFromMapPopup_BeExpert] = useState(false);
    const handleCloseMapPopup_BeExpert = () => { setOpenFromMapPopup_BeExpert(false); };
    const handleClick_openFromMapPopup_BeExpert = () => { setOpenFromMapPopup_BeExpert(true); };

    const [coordinates, setCoordinates] = useState( [ ] ); //starting points
    const [mapSelectedCountry, setMapSelectedCountry] = useState( null );
    const [mapYourCoordinates, setMapYourCoordinates] = useState( null );
    const settings = { coordinates, setCoordinates , mapSelectedCountry, setMapSelectedCountry , mapYourCoordinates, setMapYourCoordinates }

    const goTo = useGoTo();

  const [newestQuestions, setNewestQuestions] = useState();
  const [newestQuestionsPage, setNewestQuestionsPage] = useState(0);

  useEffect(() => {   //if set playingTeam !!!
    getAllAreas(geoDataRef, setAxiosLoading, setAlert);
    getNewestQuestions (newestQuestionsPage, setNewestQuestions, setAxiosLoading, setAlert);
  }, [])


  const [value, setValue] = useState(2);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleShowQuestions = () => {
      setValue(0);
    };
  const handleAskBeExpert = () => {
      setValue(3);
    };
    
    const [verticalValue, setVerticalValue] = useState(0);

return (<>
    
    <Box sx={{ textAlign: 'center', width: '100%', md: 1}}> 
    
    <Button startIcon={<Icons.Architecture/>} sx={{m: 1}} onClick={handleClick_openFromMapPopup_BeExpert} variant="contained"> Ask be Expert </Button>

    <Button startIcon={<Icons.NoteAdd/>} sx={{m: 1}} onClick={handleClick_openFromMapPopup_AddQuestion} variant="contained"> Add Your Question </Button>

     </Box>

    <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <Tabs value={value} onChange={handleChange} sx={{backgroundColor: 'azure'}} centered>
        <Tab></Tab>
        <Tab label={<Typography variant='h5' color='primary'><Icons.Explore /> Experts Area</Typography>} sx={{width: '50%', fontSize: '20pt'}} />
        <Tab label={<Typography variant='h5' color='primary'><Icons.Extension /> Last Questions</Typography>} color='prime' sx={{width: '50%', fontSize: '20pt',}} />
        <Tab></Tab>
      </Tabs>
      <TabPanel value={value} index={2}> 
      Last Questions:
      <Divider></Divider>

        <Box  sx={{wordBreak: 'break-word'}}> 

{
newestQuestions.map((question) => {
  return (<>
  <QuestionValue > {question.question} </QuestionValue>
  <Grid container>
      {question.answers.map((ans, i) => (
          <Answer isFollow={false} numberBackgroundColor={'#FFFFFFAA'} sx={question.rightAnswer === i ? {backgroundColor: 'azure'} : {}} number={ i + 1 } onClick={(e) => {
              setTimeout(() =>{e.target.parentNode.parentNode.blur();}, 500)
          }}> {ans} </Answer>
      ) ) }
  </Grid>

  <Divider></Divider>
  </>);
})
}
        </Box>
          

       </TabPanel>
      <TabPanel value={value} index={1}> <VerticalTabs auth={auth} verticalValue={verticalValue} setVerticalValue={setVerticalValue} /> </TabPanel>  
        <TabPanel value={value} index={0}> 
          <AddQuestionPopup mapSelectedCountry={mapSelectedCountry} />
        </TabPanel>
        <TabPanel value={value} index={3}> 
          Be Expert for: {mapSelectedCountry?.area}
          <br/>
          <QuestionBeExpert mapSelectedCountry={mapSelectedCountry} />
        </TabPanel>
    </Box>


    <PopUp open={openFromMapPopup_AddQuestion} handleClose={handleCloseMapPopup_AddQuestion} title="Choose Location from map" 
        handleSubmit={()=>{ 
            if(!mapSelectedCountry || !mapSelectedCountry?.area){setAlert('no selected area');return;}
                  handleCloseMapPopup_AddQuestion();
                  handleShowQuestions();
                  
            }} submitText="Set Area">  <Map geoData={geoDataRef.current} settings={settings} height='60vh' minHeight='400px'/>
    </PopUp>

    <PopUp open={openFromMapPopup_BeExpert} handleClose={handleCloseMapPopup_BeExpert} title="Choose Area for Expert" 
        handleSubmit={()=>{ 
            if(!mapSelectedCountry || !mapSelectedCountry?.area){setAlert('no selected area');return;}
                handleCloseMapPopup_BeExpert();
                handleAskBeExpert();
            }} submitText="Start Trivia">  <Map geoData={geoDataRef.current} settings={settings} height='60vh' minHeight='400px'/>
    </PopUp>
</>);
}


function VerticalTabs({auth, verticalValue, setVerticalValue}) {
    const {setLoading, setAxiosLoading, setAlert} = useLoading();
    useEffect(()=>{
      getExpertAreaQuestions(areas[verticalValue], 0, setQuestions, setAxiosLoading, setAlert, questions);
    }, [])
    const handleChange = (event, newValue) => { 
      setVerticalValue(newValue)
      getExpertAreaQuestions(areas[newValue], 0, setQuestions, setAxiosLoading, setAlert, questions);
      
      ; };
    const areas = auth?.expertAreas
    const [questions, setQuestions] = useState();
   
return (
  <Box sx={{ m:0, p:0,flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: '100%' }}>
      <Tabs sx={{ m:0, p:0,borderRight: 1, borderColor: 'divider' }} orientation="vertical" variant="scrollable" value={verticalValue} onChange={handleChange} aria-label="Vertical tabs example" >

        { areas?.map((x, i) =>  (<Tab label={x.area} {...a11yProps(i)} />)  ) }
  
      </Tabs>
        
        { areas?.map((x, i) =>  (
        
          <>
          {/*Expert Area */}
          <TabPanel  sx={{wordBreak: 'break-word'}} value={verticalValue} index={i}> {questions?.map((question) => (<>
          <Divider></Divider>
            <Box sx={{backgroundColor:'azure'}}>
              <Typography variant="body1" component="div">{question.question}</Typography>
              <Divider></Divider>
            </Box>
            {question.answers.map((answer, j) => (<Typography sx={question.rightAnswer === j ? ({fontWeight: 'bold'}) : ({})} variant="body1" component="div">{j + 1}) {answer}</Typography>) )}
            <Button variant='contained'  sx={{m:1}}>Delete</Button> {/*size="small"*/}
            <Button startIcon={<Icons.CheckBox/>} variant='contained' sx={{m:1}}>Accept</Button>
            <Divider sx={{mb: 1}}></Divider>
          </>))}</TabPanel>
        </>)  ) }
  </Box>
); }


const getNewestQuestions =  (page, setNewestQuestions, setAxiosLoading, setAlert) => {
  new DatabaseRequest( () => Axios('GET', '/api/question/' + (page||0).toString() +'/', {}, {}) )
  .GoodResult( async (result) => {
      setNewestQuestions(result.questions);
      } )
  .BadResult( (error) => {
      setAlert(error); 
      } )
  .Build(setAxiosLoading);
}

const getExpertAreaQuestions =  (area, page, setQuestions, setAxiosLoading, setAlert, questions) => {
  const areaId= area._id;
  setQuestions();
  const data = 'page=' + page;
  new DatabaseRequest( () => Axios('GET', '/api/expert/' + areaId + '?' + data, {}, {}) )
  .GoodResult( async (result) => {
      setQuestions(result.questions);
      } )
  .BadResult( (error) => {
      setAlert(error); 
      } )
  .Build(setAxiosLoading);
}

const TabPanel = ({ children, value, index, sx, ...other }) => (
  <div style={{ width: '100%', ...sx}} role="tabpanel" hidden={value !== index} id={`vertical-tabpanel-${index}`} aria-labelledby={`vertical-tab-${index}`} {...other}>
      {value === index && ( <Box sx={{ p: {xs: 1, sm:  2} }}> <Typography variant="body2">{children}</Typography> </Box> )}
  </div>);
const a11yProps = (index) => ({id: `vertical-tab-${index}`, 'aria-controls': `vertical-tabpanel-${index}`,});


const getAllAreas = (geoDataRef, setAxiosLoading, setAlert) => {
    new DatabaseRequest( () => Axios('GET', '/api/area', {}, {}) )
    .GoodResult( (result) => {
        geoDataRef.current = result;
        } )
    .BadResult( (error) => {
        setAlert(error); 
        } )
    .Build(setAxiosLoading);
}
