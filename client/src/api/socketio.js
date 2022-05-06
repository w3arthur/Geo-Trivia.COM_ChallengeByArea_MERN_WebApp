/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect} from 'react';
import { io } from "socket.io-client";
import { server } from '../Config';

const socket = io(server.webSocketUrl); // 'ws://localhost:3500'

export function receiver(waitToServerMessage, action){
    socket.on(waitToServerMessage , (x) =>  {
        let error = false;
        if(typeof(x) === 'object' && x.error){ error = {message: x.message}; }
        action(x, error)
    } );
}

export function useReceiver(waitToServerMessage, data, array){
    useEffect(() => {
        receiver(waitToServerMessage, data);
    }, array || [])
}

export function transmitter(transmitToServer, data){
    socket.emit(transmitToServer, data);
}   //please use const transmitToServer

 //playingTeamId