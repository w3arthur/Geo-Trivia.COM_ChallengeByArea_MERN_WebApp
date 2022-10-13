import React, {useState, createContext, useContext, useEffect} from "react";

const PlayingTeamContext = createContext({});


export const PlayingTeamProvider = ({ children }) => {
    const [playingTeam, setPlayingTeam] = useState({});
    const [invitedTeamId, setInvitedTeamId] = useState( null );
    const [currentQuestion, setCurrentQuestion] = useState( -1 );
    useEffect(()=> console.log('playingTeam' ,playingTeam) );
    //const [auth, setAuth] = React.useState({});   //more context
    return ( <PlayingTeamContext.Provider value={{ playingTeam, setPlayingTeam, invitedTeamId, setInvitedTeamId, currentQuestion, setCurrentQuestion }}> {children} </PlayingTeamContext.Provider> );
}

const usePlayingTeam = () => useContext(PlayingTeamContext);

export default usePlayingTeam;