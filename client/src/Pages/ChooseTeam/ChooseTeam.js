/* eslint-disable array-callback-return */
import React, { useState/*, useRef, useEffect*/ } from "react";
import { Avatar, Grid , Paper, Box, Typography } from "@mui/material";
import * as Icons from "@mui/icons-material/"; 

import { PopUp, } from '../../Components';
import { Axios, useReceiver, transmitter  } from '../../Api';
import { DatabaseRequest } from '../../Classes';
import { useAuth, usePlayingTeam, useLoading } from '../../Context';
import { useGoTo, useTranslation } from '../../Hooks';
import { profile } from '../../Images';
import { colors, sizes } from '../../Config';

import UserInvite from './UserInvite';
import User from './User';

export default function ChooseTeam(){
    const { t } = useTranslation();
    const { auth } = useAuth();
    const { setAxiosLoading, setAlert } = useLoading();
    const { playingTeam, setPlayingTeam } = usePlayingTeam();
    const [openPopup, setOpenPopup] = useState(false);

    const handleOpenPopup = () => {  handleCreateTeam(setOpenPopup, setPlayingTeam, auth, setAxiosLoading, setAlert ); };
    const handleClose = () => {  setOpenPopup(false); };

    const [userArray, setUserArray] = useState([]);

    const goTo = useGoTo();
    useReceiver(playingTeam._id ,(x, error) => {
        if(error) {alert('mistake ');}
        if(!openPopup){ return;
        } else if( x.userAccepted){
            handleGetPlayingTeam_renewData(playingTeam, setPlayingTeam, auth, setUserArray, setAxiosLoading, setAlert);
        } else if(x.playingTeamSet){
            goTo('/Question');
        }//end if
    } , [openPopup]);

return (<>
<Typography variant="h1" sx={{ fontWeight: "bold" }}> {t("Choose Team")} </Typography>
{/* Yor Area is: ... */}
<Grid container>
    <Grid item xs={12} sm={6} sx={{p:2}}>
        <SelectionValue onClick={handleOpenPopup}>
            {t("Invite")} <br /> {t("Team")} <br/>
        <Box> <Icons.Groups sx={{mt: {xs: 3 ,sm: 5}, mb: 2, fontSize: sizes.chooseTeam_AddTeamMember.groupIconSize }}/> </Box>
        </SelectionValue>
    </Grid>
    <Grid item xs={12} sm={6} sx={{p:2}}>
        <SelectionValue onClick={() => { handlePlaySingle(setPlayingTeam, auth, setAxiosLoading, goTo, setAlert ) }}>
        {t("Play")} <br /> {t("Single")} <br/>   
        <Box direction="row" sx={{ display:'flex', flexDirection: 'column', alignItems: 'center',}}>
            <Avatar src={profile} sx={{ backgroundColor: colors.chooseTeam_AddTeamMember.avatarBackgroundColor, mt: {xs:5 , sm: 8} , mb: 4 , width: sizes.chooseTeam_AddTeamMember.avatarSize, height: sizes.chooseTeam_AddTeamMember.avatarSize }} />
        </Box>
        </SelectionValue>
    </Grid>
</Grid>
<PopUp open={openPopup} handleClose={handleClose} title="Your Team"  
    handleSubmit={ () => {
        if( userArray.length === 0 ){setAlert( t("No players added, you are in team mode") );return};
        if( userArray.filter((x) => x.accepted === false).length !== 0 ){setAlert(t("Please wait until all the players will accept the invitation"));return};
        const data = {playingTeam: playingTeam};
        transmitter('playingTeamSet', data);
    } } submitText={t("Set Team")}>
  <Box sx={{minHeight: '300px'}}>
    <UserInvite playingTeam={playingTeam} setPlayingTeam={setPlayingTeam} userArray={userArray} setUserArray={ setUserArray } />
    { userArray.reverse().map((player)=>{ return (<User key={player._id} playingTeam={playingTeam} setPlayingTeam={setPlayingTeam} data={player} userArray={userArray} setUserArray={setUserArray}  />) }) }
  </Box>
</PopUp>
</>);
}

function handlePlaySingle( setPlayingTeam, auth, setAxiosLoading, goTo, setAlert ){
  const organizer = auth._id;
  const data =  { organizer };
  new DatabaseRequest( () => Axios('POST', '/api/playingTeam', data, {'authorization':  auth.accessToken}) )
    .GoodResult( (result) => {
        setPlayingTeam(result);
        goTo('/Question');
      } )
    .BadResult( (error) => { setAlert(error); } )
    .Build(setAxiosLoading);  

}

function handleGetPlayingTeam_renewData(playingTeam, setPlayingTeam, auth, setUserArray, setAxiosLoading, setAlert){
        const playingTeamId = playingTeam._id;
        new DatabaseRequest( () => Axios('GET', '/api/playingTeam/' + playingTeamId, {}, {'authorization':  auth.accessToken}) )
        .GoodResult( (result) => {
            const playersArray = result.players;
            const array = playersArray.filter((x) => x._id !== auth._id);
            setPlayingTeam(result);
            setUserArray(array);
        } )
        .BadResult( (error) => {
            setAlert(`no gaming team ${error}`); 
        } )
        .Build(setAxiosLoading);
}

const handleCreateTeam = (setOpenPopup, setPlayingTeam, auth, setAxiosLoading,  setAlert) => {
  // language will send with the cookie
  const organizer = auth._id;
  const data =  { organizer };
  new DatabaseRequest( () => Axios('POST', '/api/playingTeam', data, {'authorization':  auth.accessToken}) )
    .GoodResult( (result) => {
        setPlayingTeam(result);
        setOpenPopup(true);
      } )
    .BadResult( (error) => { setAlert(error); } )
    .Build(setAxiosLoading);  
};

function SelectionValue({onClick, children, sx ,...props}){
    return(<>
        <Paper {...props} className="select"  onClick={ onClick } sx={{ height: { md: '55vh'} ,minHeight: {sm:'55vh', md: '300px'} ,...sx}} elevation={3}>
        <Typography variant="h2" color={colors.chooseTeam_AddTeamMember.selectionMemberTextColor} sx={{mt: 8,fontSize:{xs:'28pt', md: '36pt'}}}>{children}</Typography>
        </Paper>
    </>);
}
