import React, {useState, createContext, useContext, useEffect} from "react";

const AuthContext = createContext({});

export const PlayingTeam = ({ children }) => {
    const [playingTeam, setPlayingTeam] = useState({});
    useEffect(()=> console.log('playingTeam' ,playingTeam) );
    //const [auth, setAuth] = React.useState({});   //more context
    return ( <AuthContext.Provider value={{ playingTeam, setPlayingTeam }}> {children} </AuthContext.Provider> );
}

const usePlayingTeam = () => useContext(AuthContext);

export default usePlayingTeam;