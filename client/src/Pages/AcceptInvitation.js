import React, {useEffect} from 'react';
import { /*useHistory,*/ useParams } from 'react-router-dom';
import Login from './Login';
import { io } from "socket.io-client";

const socket = io('ws://localhost:3500');

export default function AcceptInvitation(){;
    const { playingTeamId } = useParams();

useEffect(() => {
    socket.on('messageY', text => {

        
        alert(text);
        
    });
}, []);
    return (<>
    {/*<Login playingTeamId="playingTeamId"/> */}
    
    
    <button onClick={ () => {
            socket.emit('messageX', 'text');
            } }>AAAAAaaa</button>
    </>);
}