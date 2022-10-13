import React, { /*useState, */useRef } from "react";
import { IconButton, Avatar, Grid, TextField, Box } from "@mui/material";
import * as Icons from "@mui/icons-material/"; 

import { useAuth, useLoading} from '../../Context';
import { profile } from '../../Images';
import { Axios } from '../../api1';
import { DatabaseRequest } from '../../Classes';
import { colors, sizes } from '../../Config';
import { useTranslation } from '../../Hooks';

export default function UserInvite ({userArray, setUserArray, playingTeam, setPlayingTeam}) {
    const { t } = useTranslation();
    const emailRef = useRef( );
    const { setAxiosLoading, setAlert } = useLoading();
    const { auth, setAuth } = useAuth( );
const render = () => (<>
<Grid container sx={{mb: 1,pl: '3px',}}>
    <Grid item xs='1' sm='1'> 
        <Avatar src={profile} sx={{ backgroundColor: colors.chooseTeam_AddTeamMember.avatarBackgroundColor, mt: {xs: 0, sm: 3} , ml: {xs: '-3px', sm: 0} , width: sizes.chooseTeam_AddTeamMember.memberAvatarSize , height: sizes.chooseTeam_AddTeamMember.memberAvatarSize }} />
    </Grid>
    <Grid item xs='9' sm='10' sx={{pl: '3px'}}>
         {/* <Typography variant="h4" sx={{textAlign: 'left', m:3}}>Email</Typography>  */}

        <TextField inputRef = {emailRef} autoFocus autoComplete="email" label={t("Set Member Email")} margin="normal" fullWidth />
    </Grid>
    <Grid item xs='1' sm='1' sx={{zIndex: 1}}>
    <Box sx={{mt: {xs: 5, sm: 3 }, ml: {xs: -2, sm: 0 }}}>
        <IconButton onClick={ handleUserAdd }>
            <Icons.Add sx={{ fontSize: sizes.chooseTeam_AddTeamMember.iconAddInvitePlayerSize}} />
        </IconButton>
    </Box> 
    </Grid>
</Grid>
</>);


const handleUserAdd = () => {
    //previous checker for array
    const email = emailRef.current.value;
    if(email.trim() === ''){setAlert(t("entered empty email address."));return;}
    if(email.trim() === auth.email){setAlert(t("entered your email address."));return;}
    if(userArray.filter((x) => x.email === email.trim()).length !== 0){setAlert("entered existed email address.");return;}
    const playingTeamId = playingTeam._id;
    const playerEmail = email;
    const data = {playingTeamId, playerEmail};
    new DatabaseRequest( () => Axios('PATCH', '/api/playingTeam', data, {'authorization':  auth.accessToken}) )
    .GoodResult( (result) => {
        const array = (result.players).filter((x) => x.email !== auth.email);
        setUserArray(array); 
        emailRef.current.value = '';
        emailRef.current.focus();
    } )
    .BadResult( (error) => { setAlert(error); } )
    .Build(setAxiosLoading);  
};

return render();}

