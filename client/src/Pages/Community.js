import React, {useEffect, useRef, useState} from 'react';
import {Box, Tabs, Tab, Toolbar, AppBar,  Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from "@mui/material";
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

const geoData =  [ { _id:"0", location:{ coordinates: [35, 32] }, country: "Error", area:  "Error Point" } ];

export default function Community(){
    const { t } = useTranslation();
    const { auth , setAuth } = useAuth();
    const {setLoading, setAxiosLoading, setAlert} = useLoading();
    const geoDataRef = useRef(geoData);

    const [openFromMapPopup, setOpenFromMapPopup] = useState(false);
    const [openPopup, setOpenPopup] = useState(false);
    const handleCloseAddQuestionPopup = () => {  setOpenPopup(false); };
    const handleOpenAddQuestionPopup = () => { if(!mapSelectedCountry || !mapSelectedCountry?.area){setAlert('no selected area');return;} setOpenPopup(true); };

    const handleCloseMapPopup = () => { setOpenFromMapPopup(false); };
    const handleClick_openFromMapPopup = () => { setOpenFromMapPopup(true); };

    const [coordinates, setCoordinates] = useState( [ ] ); //starting points
    const [mapSelectedCountry, setMapSelectedCountry] = useState( null );
    const [mapYourCoordinates, setMapYourCoordinates] = useState( null );
    const settings = { coordinates, setCoordinates , mapSelectedCountry, setMapSelectedCountry , mapYourCoordinates, setMapYourCoordinates }

    const goTo = useGoTo();

    useEffect(() => {   //if set playingTeam !!!
     getAllAreas(geoDataRef, setAxiosLoading, setAlert);
   }, [])


  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

const handleShowQuestions = () => {
    setValue(2);
  };
   
return (<>
    
    <Box sx={{ textAlign: 'center', width: '100%'}}>
    <Button onClick={handleClick_openFromMapPopup} variant="contained"> Add Your Question </Button>
    </Box>


    <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <Tabs value={value} onChange={handleChange} sx={{backgroundColor: 'azure'}} centered>
        <Tab label={<Typography variant='h5' color='primary'>Last Questions</Typography>} color='prime' sx={{width: '50%', fontSize: '20pt',}} />
        <Tab label={<Typography variant='h5' color='primary'>Experts Area</Typography>} sx={{width: '50%', fontSize: '20pt'}} />
      </Tabs>

        <TabPanel value={value} index={0}> Last Questions Here </TabPanel>
        <TabPanel value={value} index={1}> <VerticalTabs /> </TabPanel>
        <TabPanel value={value} index={2}> 
        
        <AddQuestionPopup mapSelectedCountry={mapSelectedCountry} /*handleClose={handleCloseMapPopup} openPopup={openPopup} handleCloseAddQuestionPopup={handleCloseAddQuestionPopup}*/ />
        
         </TabPanel>

    </Box>

 



    



    <PopUp open={openFromMapPopup} handleClose={handleCloseMapPopup} title="Choose Location from map" 
        handleSubmit={()=>{ 
            //if no selected area, dont close!
            if(!mapSelectedCountry || !mapSelectedCountry?.area){setAlert('no selected area');return;}
            handleCloseMapPopup();
            //handleOpenAddQuestionPopup();
            handleShowQuestions()
            //handleSetArea()   //? to delete
            }} submitText="Set Area">  <Map geoData={geoDataRef.current} settings={settings} height='60vh' minHeight='400px'/>
    </PopUp>
    
</>);
}


function VerticalTabs() {
    const [value, setValue] = useState(0);
    const handleChange = (event, newValue) => { setValue(newValue); };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: '100%' }}>
        <Tabs sx={{ borderRight: 1, borderColor: 'divider' }} orientation="vertical" variant="scrollable" value={value} onChange={handleChange} aria-label="Vertical tabs example" >
            <Tab label="Country 1" {...a11yProps(0)} />
            <Tab label="Country 2" {...a11yProps(1)} />
            <Tab label="Country 3" {...a11yProps(2)} />
            <Tab label="Country 4" {...a11yProps(3)} />
            <Tab label="Country 5" {...a11yProps(4)} />
            <Tab label="Country 6" {...a11yProps(5)} />
            <Tab label="Country 7" {...a11yProps(6)} />
        </Tabs>
      <TabPanel value={value} index={0}> <QuestionsExample/>  </TabPanel>
      <TabPanel value={value} index={1}> <QuestionExample value="Question Two" /> </TabPanel>
      <TabPanel value={value} index={2}> <QuestionExample value="Question Three" /> </TabPanel>
      <TabPanel value={value} index={3}> <QuestionExample value="Question Four" /> </TabPanel>
      <TabPanel value={value} index={4}> <QuestionExample value="Question Five" /> </TabPanel>
      <TabPanel value={value} index={5}> <QuestionExample value="Question Six" /> </TabPanel>
      <TabPanel value={value} index={6}> <QuestionsExample/>  </TabPanel>
    </Box>
  );
}


function QuestionExample({value}){

    return (<>
        {value} <br/> <Button variant="contained" size="small">Accept</Button> <br />
    </>);
}

function QuestionsExample(){
    return (<>
        <QuestionExample value="Question One" />
        <QuestionExample value="Question Two" />
        <QuestionExample value="Question Three" />
        <QuestionExample value="Question Four" />
        <QuestionExample value="Question Five" />
        <QuestionExample value="Question Six" />
        <QuestionExample value="Question Seven" />
    </>);
}

const TabPanel = ({ children, value, index, sx, ...other }) => (
<div style={{ width: '100%', ...sx}} role="tabpanel" hidden={value !== index} id={`vertical-tabpanel-${index}`} aria-labelledby={`vertical-tab-${index}`} {...other}>
    {value === index && ( <Box sx={{ p: 3 }}> <Typography variant="body2">{children}</Typography> </Box> )}
</div>);

const a11yProps = (index) => ({id: `vertical-tab-${index}`, 'aria-controls': `vertical-tabpanel-${index}`,});

const handleSetArea = (handleClose, coordinates, mapSelectedCountry, mapYourCoordinates, setAxiosLoading, setAlert) => {
// ???
};

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
