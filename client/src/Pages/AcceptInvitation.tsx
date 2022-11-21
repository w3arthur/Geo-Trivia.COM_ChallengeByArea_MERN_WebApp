/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect} from 'react';
import { /*useHistory,*/ useParams } from 'react-router-dom';

import { Axios } from '../Api';
import { DatabaseRequest } from '../Classes';
import { usePlayingTeam, useLoading } from '../Context';
import { useGoTo } from '../Hooks';


export default function AcceptInvitation(){;
    const { setAxiosLoading, setAlert } = useLoading();
    const { playingTeamId } = useParams();
    const {invitedTeamId, setInvitedTeamId} = usePlayingTeam();
    const goTo = useGoTo();
        
    useEffect(() => {
        setInvitedTeamId({});
        //if exist such team! go on to login
        new DatabaseRequest( () => Axios('GET', '/api/login/acceptTeam?playingTeam='+ playingTeamId , {}, {}) )
            .GoodResult( () => {
                setInvitedTeamId(playingTeamId);
                goTo('/Login')
            } )
            .BadResult( (error) => {
                setAlert(`no gaming team available + ${error}`); 
            } )
            .Build(setAxiosLoading);
    }, [])

    const data = {playingTeamId: playingTeamId }

    const render = () => (<>
    {/* <Login playingTeamId="playingTeamId"/> */}
    
    </>);
return render();}