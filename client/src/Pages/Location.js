import React, {useRef, useEffect, useState} from "react";
import { Grid, Card, Chip , Paper, Link, Box, Button, Typography } from "@mui/material";

import { PopUp, Map } from '../Components';

import { DatabaseRequest } from '../Classes';
import { useAuth, usePlayingTeam, useLoading } from '../Context';
import { useGoTo, useTranslation } from '../Hooks';
import { monkeyLeft, monkeyRight, globe } from '../Images'

import { Axios, useReceiver, receiver, transmitter  } from '../Api';


//fake example for database error handler
const geoData =  [ { _id:"0", location:{ coordinates: [35, 32] }, country: "Error", area:  "Error Point" } ];

export default function Location() {
  const { t } = useTranslation();
  const { auth , setAuth } = useAuth();
  const {setLoading, setAxiosLoading} = useLoading();

  const { playingTeam, setPlayingTeam } = usePlayingTeam();

  const goTo = useGoTo();
  
  const geoDataRef = useRef(geoData);

  useReceiver( playingTeam._id ,(x, error) => { 
    alert('receiver')
    const playingTeamId = playingTeam._id;
    if(error){ alert(`error ${error.message}`) 
    } else if(x.userAccepted === true){
     // setLoading(false);
      alert('user accepted ')
    } else if(x.playingTeamSet === true){
      setLoading(false);
      goTo('/Question');
    } //end if
  }, []);

  useEffect(() => { 
    const playingTeamId = playingTeam._id;
    console.log('aaaaa ', auth._id, playingTeam._id)
    if(auth && playingTeam && auth._id && playingTeam._id){
      
      handleUserInvitation(auth, playingTeam, setLoading, setAxiosLoading);

    } else getAllAreas(geoDataRef, setAxiosLoading);

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

return (<>
<Typography variant="h1" sx={{ fontWeight: "bold" }}> {t("Location")} </Typography>
<Grid container>

  <Selection onClick={handleClick_openFromListPopup} leftMonkey>Choose Location <br /> from list</Selection>

  <Selection onClick={handleClick_openFromMapPopup} rightMonkey>Choose Location <br /> from map</Selection>

  <Selection onClick={handleClick_yourLocationPopup} leftBottomMonkey>Your <br /> Location</Selection>

</Grid>

{/* Location From List */}
<PopUp open={openFromListPopup} handleClose={handleClose} title="Choose Location from list" handleSubmit={()=>{ handleSetArea(goTo, auth , setAuth, coordinates, setAxiosLoading /*setErrMsg*/) }} submitText="Set Area">
  <Map geoData={geoDataRef.current} show='list' settings={settings} height='55vh' minHeight='200px' />
</PopUp>

{/* Location From Map */}
<PopUp open={openFromMapPopup} handleClose={handleClose} title="Choose Location from map" handleSubmit={()=>{ handleSetArea(goTo ,auth , setAuth, coordinates, setAxiosLoading /*setErrMsg*/) }} submitText="Set Area">
  <Map geoData={geoDataRef.current} settings={settings} height='60vh' minHeight='400px'/>
</PopUp>

    {/* Your Location GPS */}
<PopUp open={openYourLocationPopup} handleClose={handleClose} title="Your Location"  handleSubmit={()=>{ handleSetArea(goTo, auth , setAuth, coordinates, setAxiosLoading /*setErrMsg*/) }} submitText="Set Area">
  <Map geoData={geoDataRef.current} show='yourLocation' settings={settings} height='55vh' minHeight='300px' />
</PopUp>

</>);
}

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


function handleUserInvitation(auth, playingTeam, setLoading, setAxiosLoading){
        const data = {player: auth, playingTeam: playingTeam}
        new DatabaseRequest( () => Axios('PATCH', '/api/playingTeam/accept', data, {}) )
        .GoodResult( (result) => {
          setLoading(true);
           
          transmitter('playingTeamAddUser', data);
          alert('handleUserInvitation v'); 
        } )
        .BadResult( (error) => {
            alert(`no gaming team  ${error}`); 
        } )
        .Build(setAxiosLoading);
}

const getAllAreas = (geoDataRef, setAxiosLoading) => {
      new DatabaseRequest( () => Axios('GET', '/api/area', {}, {}) )
    .GoodResult( (result) => {
      console.log('areas', result)
      geoDataRef.current = result;
      } )
    .BadResult( (error) => {
       alert(error); 
      } )
    .Build(setAxiosLoading);

}

const handleSetArea = (goTo, auth , setAuth, coordinates, setAxiosLoading) => {
  // language will send with the cookie
  const user = auth._id;
  const data =  { user , coordinates};
  new DatabaseRequest( () => Axios('PUT', '/api/user', data, {}) )
    .GoodResult( (result) => {
      if(result) goTo("/Choose");
      } )
    .BadResult( (error) => { alert(error); } )
    .Build(setAxiosLoading);  
};



function SelectionValue({onClick, children, sx ,...props}){
  return(<>
      <Paper {...props} className="select"  onClick={ onClick } sx={{height: '50vh', minHeight: {sm:'250px', md: '300px'} , 
      backgroundImage: `url(${globe})`,backgroundRepeat: 'no-repeat', backgroundPosition: '20% 44%', backgroundSize: '140% 140%',  ...sx}} elevation={3}>
        <Typography variant="h2" color="secondary" sx={{mt: 8,fontSize:{xs:'24pt', md: '38pt'}}}>{children}</Typography>
      </Paper>
  </>);
}

function SelectionMonkeyImageGrid(props){
  return(<>
    <Grid item onClick={props.onClick} xs={4} sx={{height: '100%',display: { xs: 'block', sm: 'none' }}}>
      {props.children}
    </Grid>
  </>);
}