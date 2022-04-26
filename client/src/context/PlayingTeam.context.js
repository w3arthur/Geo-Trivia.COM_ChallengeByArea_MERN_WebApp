import React, {useState, createContext, useContext, useEffect} from "react";

const PlayingTeamContext = createContext({});


export const PlayingTeamProvider = ({ children }) => {
    const [playingTeam, setPlayingTeam] = useState({});
    const [invitedTeamId, setInvitedTeamId] = useState( null );
    useEffect(()=> console.log('playingTeam' ,playingTeam) );
    //const [auth, setAuth] = React.useState({});   //more context
    return ( <PlayingTeamContext.Provider value={{ playingTeam, setPlayingTeam, invitedTeamId, setInvitedTeamId }}> {children} </PlayingTeamContext.Provider> );
}

const usePlayingTeam = () => useContext(PlayingTeamContext);

export default usePlayingTeam;