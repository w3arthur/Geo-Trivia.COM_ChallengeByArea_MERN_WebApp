import React from "react";


import {Chip, Avatar, Box, Toolbar, AppBar,  Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from "@mui/material";
import { styled } from '@mui/material/styles';
import * as Icons from '@mui/icons-material';
import { boom } from '../Images';

export default function Boom({}){

    return (<>
        <img src={boom} alt="boom" style={{width:'100%', maxWidth: '400px',height:'auto'}} />
    </>);
}

