import React from "react";
import { Avatar, Box,  Button, Typography } from "@mui/material";
import { profile } from '../Images';

import { useAuth, usePlayingTeam } from '../Context';

export default function Follow({handleFollow}){
    const { auth } = useAuth();
    const { playingTeam } = usePlayingTeam();

    const { players } = playingTeam;
    const anotherPlayers = players?.filter((x)=>x._id !== auth._id);
    return (<>
    {anotherPlayers?.map((x) => (<UserToFollow key={x._id} alt={x.email} src={profile} onClick={() => { handleFollow( x._id ) }}>{x.email}</UserToFollow>))}
    </>);
}

function UserToFollow({key, sx, alt, src, onClick, children, ...props}){

return(<>
    <Box sx={{p: 1}} >
        <Button  {...props} onClick={onClick} variant="outlined" startIcon={<Avatar alt={alt} src={src} sx={{ backgroundColor: "#faae1c", m: '2px', ...sx}}/>} fullWidth>
            <Typography key={key} sx={{width: '100%', fontSize: {xs: 17, sm:22, md:28}, textTransform: 'capitalize'}}>{children}</Typography>
        </Button>
    </Box>
</>)
}