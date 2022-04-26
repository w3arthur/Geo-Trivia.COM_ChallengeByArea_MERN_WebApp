import React, {useState, createContext, useContext, useEffect} from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});
    useEffect(()=> console.log('auth' ,auth) );
    //const [auth, setAuth] = React.useState({});   //more context
    return ( <AuthContext.Provider value={{ auth, setAuth }}> {children} </AuthContext.Provider> );
}

const useAuth = () => useContext(AuthContext);

export default useAuth;