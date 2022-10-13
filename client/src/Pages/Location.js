/* eslint-disable react-hooks/exhaustive-deps */
import React, {useRef, useEffect, useState} from "react";
import { Grid, Paper, Typography } from "@mui/material";

import { DatabaseRequest } from '../Classes';
import { useAuth, usePlayingTeam, useLoading } from '../Context';
import { useGoTo, useTranslation } from '../Hooks';
import { monkeyLeft, monkeyRight, globe } from '../Images'
import { Axios, useReceiver, transmitter  } from '../api1';
import { PopUp, Map } from '../Components';
import { map } from '../Config'

const geoData =  map.geoDataErrorExamplePoints; //  [ { _id:"0", location:{ coordinates: [35, 32] }, country: "Error", area:  "Error Point" } ]

export default function Location() {
  const { t } = useTranslation();
  const { auth , setAuth } = useAuth();
  const { invitedTeamId, setInvitedTeamId, setPlayingTeam} = usePlayingTeam();
  const {setLoading, setAxiosLoading, setAlert} = useLoading();
  const goTo = useGoTo();

  useReceiver( invitedTeamId ,(x, error) => { 
    if(!invitedTeamId) return;
    //const playingTeamId = invitedTeamId;
    if(error){ alert(`error ${error.message}`) 
    } else if(x.userAccepted === true){
        setLoading(true);
    } else if(x.playingTeamSet === true){
        goTo('/Question');
    } //end if
  }, []);

  const geoDataRef = useRef(geoData);
  useEffect(() => {   //if set playingTeam !!!
    if(auth && auth._id && invitedTeamId){
      handleUserInvitation();
    } else getAllAreas();
   }, [])
 
  const [coordinates, setCoordinates] = useState( [ ] ); //starting points
  const [mapSelectedCountry, setMapSelectedCountry] = useState( null );
  const [mapYourCoordinates, setMapYourCoordinates] = useState( null );
  const settings = { coordinates, setCoordinates , mapSelectedCountry, setMapSelectedCountry , mapYourCoordinates, setMapYourCoordinates }

  const [openFromListPopup, setOpenFromListPopup] = useState(false);
  const [openFromMapPopup, setOpenFromMapPopup] = useState(false);
  const [openYourLocationPopup, setOpenYourLocationPopup] = useState(false);

  const handleClick_openFromListPopup = () => { setOpenFromListPopup(true); };
  const handleClick_openFromMapPopup = () => { setOpenFromMapPopup(true); };
  const handleClick_yourLocationPopup = () => { setOpenYourLocationPopup(true); };
  const handleClose = () => { setOpenFromListPopup(false); setOpenFromMapPopup(false); setOpenYourLocationPopup(false); };

const render = () => (<>
  <Typography variant="h1" sx={{ fontWeight: "bold" }}> {t("Location Set")} </Typography>
  <Grid container sx={{direction: 'ltr'}}>
    <Selection onClick={handleClick_openFromListPopup} leftMonkey>{t("Choose Location.")} <br /> {t(".from list")}</Selection>
    <Selection onClick={handleClick_openFromMapPopup} rightMonkey>{t("Choose Location_")} <br /> {t("_from map")}</Selection>
    <Selection onClick={handleClick_yourLocationPopup} leftBottomMonkey>{t("Your_")} <br /> {t("_Location")}</Selection>
  </Grid>
  {/* Location From List */}
  <PopUp open={openFromListPopup} handleClose={handleClose} title="Choose Location from list" handleSubmit={ handleSetArea} submitText={t("Set Area Submit")}>
    <Map geoData={geoDataRef.current} show='list' settings={settings} height='55vh' minHeight='200px' />
  </PopUp>

  {/* Location From Map */}
  <PopUp open={openFromMapPopup} handleClose={handleClose} title="Choose Location from map" handleSubmit={ handleSetArea } submitText={t("Set Area Submit")}>
    <Map geoData={geoDataRef.current} settings={settings} height='60vh' minHeight='400px'/>
  </PopUp>

  {/* Your Location GPS */}
  <PopUp open={openYourLocationPopup} handleClose={handleClose} title="Your Location"  handleSubmit={ handleSetArea } submitText={t("Set Area Submit")}>
    <Map geoData={geoDataRef.current} show='yourLocation' settings={settings} height='55vh' minHeight='300px' />
  </PopUp>
</>);


function handleUserInvitation(){
  const data = {player: auth._id, playingTeam: invitedTeamId};
  new DatabaseRequest( () => Axios('PATCH', '/api/playingTeam/accept', data, {'authorization':  auth.accessToken}) )
  .GoodResult( (result) => {
    setInvitedTeamId(undefined);
    setPlayingTeam(result);
    setLoading(true);
    transmitter('playingTeamAddUser', data);
    } )
  .BadResult( (error) => { setAlert(error); } )
  .Build(setAxiosLoading);
}

const getAllAreas = () => {
    new DatabaseRequest( () => Axios('GET', '/api/area', {}, {'authorization':  auth.accessToken}) )
  .GoodResult( (result) => { geoDataRef.current = result; } )
  .BadResult( (error) => { setAlert(error); } )
  .Build(setAxiosLoading);
}

const handleSetArea = () => {
  // language will send with the cookie
  const user = auth._id;
  const data =  { user , coordinates};
  new DatabaseRequest( () => Axios('PUT', '/api/user', data, {'authorization':  auth.accessToken}) )
    .GoodResult( (result) => { if(result) goTo("/Choose"); } )
    .BadResult( (error) => { setAlert(error); } )
    .Build(setAxiosLoading);  
};

return render();}

function Selection(props){
  const {leftMonkey, leftBottomMonkey, rightMonkey} = props;
  const additionStyle = leftMonkey? ({marginLeft: 'auto', marginTop: '30vh'}) 
    : rightMonkey? ({marginRight: 'auto', marginTop: '25vh'})
    : leftBottomMonkey? ({marginLeft: 'auto', marginTop: '20vh'})
    : null;
  const styleImage = {display: 'block', width: '75%', maxHeight: '75%', maxWidth: '75%', ...additionStyle};
return(<>
  <Grid item sm={4} sx={{p:2, display: { xs: 'none', sm: 'block' }}}>
      <SelectionValue onClick={props.onClick}>{props.children}</SelectionValue>
  </Grid>
  {leftMonkey || leftBottomMonkey  ? 
  <SelectionMonkeyImageGrid onClick={props.onClick}>
    <img alt="monkeyLeft" src={monkeyLeft} style={styleImage}/>
  </SelectionMonkeyImageGrid> : null}

  <Grid item xs={8} sx={{p:1 ,height: '100%' ,display: { xs: 'block', sm: 'none' }}}>
    <SelectionValue onClick={props.onClick}>{props.children}</SelectionValue>
  </Grid>
  {rightMonkey ? (
    <SelectionMonkeyImageGrid onClick={props.onClick}>
        <img alt="monkeyRight" src={monkeyRight} style={styleImage} />
    </SelectionMonkeyImageGrid>
  ) : (<></>)}
</>);
}

function SelectionValue({onClick, children, sx ,...props}){
return(<>
    <Paper {...props} className="select"  onClick={ onClick } sx={{height: '50vh', minHeight: {sm:'250px', md: '300px'} , 
    backgroundImage: `url(${globe})`,backgroundRepeat: 'no-repeat', backgroundPosition: '20% 44%', backgroundSize: '140% 140%',  ...sx}} elevation={3}>
      <Typography variant="h2" color="secondary" sx={{mt: 8,fontSize:{xs:'24pt', md: '38pt'}}}>{children}</Typography>
    </Paper>
</>);
}

function SelectionMonkeyImageGrid(props){ return(<> <Grid item onClick={props.onClick} xs={4} sx={{height: '100%',display: { xs: 'block', sm: 'none' }}}> {props.children} </Grid> </>); }