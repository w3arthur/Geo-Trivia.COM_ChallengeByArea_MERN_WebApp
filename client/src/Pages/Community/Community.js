/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useRef, useState} from 'react';
import { Box, Tabs, Tab,  Button, Typography } from "@mui/material";
import * as Icons from '@mui/icons-material';

import { PopUp, Map, } from '../../Components';
import { DatabaseRequest } from '../../Classes';
import { useAuth, useLoading } from '../../Context';
import { useTranslation } from '../../Hooks';
import { Axios } from '../../Api';
import QuestionBeExpert from "./QuestionBeExpert";
import { map, colors, sizes } from '../../Config'
import { goodLuck } from '../../Images'

import AddQuestion from './AddQuestion';
import ExpertAreaVerticalTabs from './ExpertArea';
import NewestQuestions from './NewestQuestions';

const geoData = map.geoDataErrorExamplePoints;  //[ { _id:"0", location:{ coordinates: [35, 32] }, country: "Error", area:  "Error Point" } ]

export default function Community(){
  const { t } = useTranslation();
  const { auth } = useAuth();
  const { setAxiosLoading, setAlert } = useLoading();
  const geoDataRef = useRef(geoData);

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

  const [newestQuestions, setNewestQuestions] = useState();
  const [newestQuestionsPage, setNewestQuestionsPage] = useState(1);
  const [newestQuestionsLastPage, setNewestQuestionsLastPage] = useState(false);

  useEffect(() => {
    getAllAreas(auth, geoDataRef, setAxiosLoading, setAlert);
    getNewestQuestions (auth, newestQuestionsPage, setNewestQuestionsLastPage, setNewestQuestions, setAxiosLoading, setAlert);
    }, [])

  const [value, setValue] = useState(2);  //begin from tab 2, newest_questions

  const handleChange = (event, newValue) => { setValue(newValue);};
  const handleShowQuestions = () => { if(alternativeContent_AddQuestion)setAlternativeContent_AddQuestion(); setValue(0); };
  const handleAskBeExpert = () => {
    setAlternativeContent_BeExpert_WelcomePage(true);
    setAlternativeContent_BeExpert(' ');
    setValue(3);
      };
  const [verticalValue, setVerticalValue] = useState(0);

  const [alternativeContent_AddQuestion, setAlternativeContent_AddQuestion]= useState();
  const [alternativeContent_BeExpert, setAlternativeContent_BeExpert]= useState();
  const [alternativeContent_BeExpert_WelcomePage, setAlternativeContent_BeExpert_WelcomePage]= useState(true);
return (<>
<Box sx={{ textAlign: 'center', width: '100%', md: 1}}> 
  <Button startIcon={<Icons.Architecture/>} sx={{m: 1}} onClick={handleClick_openFromMapPopup_BeExpert} variant="contained"> {t("Ask be Expert")} </Button>
  <Button startIcon={<Icons.NoteAdd/>} sx={{m: 1}} onClick={handleClick_openFromMapPopup_AddQuestion} variant="contained"> {t("Add Your Question")} </Button>
</Box>
<Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
  <Tabs value={value} onChange={handleChange} sx={{backgroundColor: colors.community.globalTabsLineBackgroundColor }} centered>
    <Tab sx={{display: 'none'}}></Tab>
    <Tab label={<Typography variant='h5' color='primary'><Icons.Explore /> {t("Experts Area")}</Typography>} sx={{width: '50%', fontSize: sizes.community.tabTextSize }} />
    <Tab label={<Typography variant='h5' color='primary'><Icons.Extension /> {t("Latest Questions")}</Typography>} color='prime' sx={{width: '50%', fontSize: sizes.community.tabTextSize }} />
    <Tab sx={{display: 'none'}}></Tab>
  </Tabs>
  <TabPanel value={value} index={2}> 
    {t("Latest Questions:")}
    <NewestQuestions dataNewestQuestions={{newestQuestionsPage, setNewestQuestionsPage, newestQuestions, setNewestQuestions, newestQuestionsLastPage, setNewestQuestionsLastPage}}/>
  </TabPanel>
  <TabPanel value={value} index={1}> <ExpertAreaVerticalTabs auth={auth} verticalValue={verticalValue} setVerticalValue={setVerticalValue} /></TabPanel>  
  <TabPanel value={value} index={0}> {alternativeContent_AddQuestion? (<>{alternativeContent_AddQuestion}</>) : (<AddQuestion mapSelectedCountry={mapSelectedCountry} setAlternativeContent={setAlternativeContent_AddQuestion} />)} </TabPanel>
  <TabPanel value={value} index={3}> 
  {alternativeContent_BeExpert_WelcomePage? (<> 
  <Typography>
    {t("Welcome to expert request for")} <Typography component='span' sx={{fontWeight: 'bold'}}>{t(mapSelectedCountry?.area)}</Typography> <br/>
    {t("Expert is very responsible role")}<br/>
    {t("You can achieve it by answer right 4/5 questions.")}  <br/>
    </Typography>
    <img src={goodLuck} alt="good luck!" style={{width:'150px',height:'auto'}} />  <br/>
  <Button variant="contained" onClick={() => {setAlternativeContent_BeExpert_WelcomePage(false);setAlternativeContent_BeExpert();}}>{t("Start Trivia")}</Button>
  </>) : (<></>)}
  {alternativeContent_BeExpert? (<>{alternativeContent_BeExpert}</>) :(<>
    {t("Be Expert for:")} {t(mapSelectedCountry?.area)} <br/>
    <QuestionBeExpert mapSelectedCountry={mapSelectedCountry}  setAlternativeContent={setAlternativeContent_BeExpert} />
    </>)} 
  </TabPanel>
</Box>
{/*Choose Area for AddQuestion */}
<PopUp open={openFromMapPopup_AddQuestion} handleClose={handleCloseMapPopup_AddQuestion} title={t("Choose Location from map")}
    handleSubmit={()=>{ 
        if(!mapSelectedCountry || !mapSelectedCountry?.area){ setAlert(t("no selected area")); return; }
              handleCloseMapPopup_AddQuestion();
              handleShowQuestions();
        }} submitText={t("Set Area")}>  <Map geoData={geoDataRef.current} settings={settings} height='60vh' minHeight='400px'/>
</PopUp>
{/*Choose Area for BeExpert */}
<PopUp open={openFromMapPopup_BeExpert} handleClose={handleCloseMapPopup_BeExpert} title={t("Choose Area for Expert")}
    handleSubmit={()=>{ 
        if(!mapSelectedCountry || !mapSelectedCountry?.area){ setAlert('no selected area'); return; }
            handleCloseMapPopup_BeExpert();
            handleAskBeExpert();
        }} submitText={t("Start Trivia")}> <Map geoData={geoDataRef.current} settings={settings} height='60vh' minHeight='400px'/>
</PopUp>
</>);
}

const getAllAreas = (auth, geoDataRef, setAxiosLoading, setAlert) => {
  new DatabaseRequest( () => Axios('GET', '/api/area', {}, {'authorization':  auth.accessToken}) )
  .GoodResult( (result) => { geoDataRef.current = result; } )
  .BadResult( (error) => { setAlert(error); } )
  .Build(setAxiosLoading);
}

export const getNewestQuestions =  (auth, page, setNewestQuestionsLastPage, setNewestQuestions, setAxiosLoading, setAlert) => { //this item exported to Newest Questions too
  new DatabaseRequest( () => Axios('GET', '/api/question/' + (page||0).toString() +'/', {}, {'authorization':  auth.accessToken}) )
  .GoodResult( (result) => { if(result.lastPage) setNewestQuestionsLastPage(true); setNewestQuestions(result.questions); } )
  .BadResult( (error) => { setAlert(error); } )
  .Build(setAxiosLoading);
}

export const TabPanel = ({ children, value, index, sx, ...other }) => (
  <div style={{ width: '100%', ...sx}} role="tabpanel" hidden={value !== index} id={`vertical-tabpanel-${index}`} aria-labelledby={`vertical-tab-${index}`} {...other}>
      {value === index && ( <Box sx={{ p: {xs: 1, sm:  2} }}> <Typography variant="body2">{children}</Typography> </Box> )}
  </div>);