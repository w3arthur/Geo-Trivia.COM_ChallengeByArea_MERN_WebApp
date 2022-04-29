/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect} from 'react';
import { /*useHistory,*/ useParams } from 'react-router-dom';
import { useReceiver, receiver, transmitter } from '../Api'


import { PopUp, Map } from '../Components';
import { Axios,  } from '../Api';
import { DatabaseRequest } from '../Classes';
import { useAuth, usePlayingTeam, useLoading } from '../Context';
import { useGoTo, useTranslation } from '../Hooks';



export default function AcceptInvitation(){;

    const { setAxiosLoading, setAlert } = useLoading();

    const { playingTeamId } = useParams();

    const {invitedTeamId, setInvitedTeamId} = usePlayingTeam();
    const goTo = useGoTo();
        
    useEffect(() => {
        setInvitedTeamId({});
        new DatabaseRequest( () => Axios('GET', '/api/playingTeam/' + playingTeamId, {}, {}) )
            .GoodResult( (result) => {
                setInvitedTeamId(result._id);
                goTo('/Login')
            } )
            .BadResult( (error) => {
                setAlert(`no gaming team ${error}`); 
            } )
            .Build(setAxiosLoading);
    }, [])

    const data = {playingTeamId: playingTeamId }

    return (<>
    {/* <Login playingTeamId="playingTeamId"/> */}
    
    </>);
}