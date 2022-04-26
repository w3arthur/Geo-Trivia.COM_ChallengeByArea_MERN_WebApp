/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect} from 'react';
import { /*useHistory,*/ useParams } from 'react-router-dom';
import { useReceiver, receiver, transmitter } from '../Api'


import { PopUp, Map } from '../Components';
import { Axios,  } from '../Api';
import { DatabaseRequest } from '../Classes';
import { useAuth, usePlayingTeam } from '../Context';
import { useGoTo, useTranslation } from '../Hooks';



export default function AcceptInvitation(){;
    const { playingTeamId } = useParams();

    const {playingTeam, setPlayingTeam} = usePlayingTeam();
    const goTo = useGoTo();
        
    useEffect(() => {
        setPlayingTeam({});

    new DatabaseRequest( () => Axios('GET', '/api/playingTeam/' + playingTeamId, {}, {}) )
        .GoodResult( (result) => {
            setPlayingTeam(result);
            console.log('playingTeam', playingTeam);
            goTo('/Login')
        } )
        .BadResult( (error) => {
            alert(`no gaming team ${error}`); 
        } )
        .Build();


    }, [])

    const data = {playingTeamId: playingTeamId }

    return (<>
    {/* <Login playingTeamId="playingTeamId"/> */}
    
    <button onClick={ () =>  transmitter('playingTeamAddUser', data)  }>AAAAAaaa</button>
    </>);
}