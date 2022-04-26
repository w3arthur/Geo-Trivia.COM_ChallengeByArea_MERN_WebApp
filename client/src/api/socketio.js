/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect} from 'react';
import { io } from "socket.io-client";

const socket = io('ws://localhost:3500');

export function receiver(waitToServerMessage, action){
    socket.on(waitToServerMessage , (x) =>  action(x) );
}

export function useReceiver(waitToServerMessage, data){
    useEffect(() => {
        receiver(waitToServerMessage, data);
    }, [])
}

export function transmitter(transmitToServer, data){
    socket.emit(transmitToServer, data);
}   //please use const transmitToServer

 //playingTeamId