import React, {useState, createContext, useContext} from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});
    //const [auth, setAuth] = React.useState({});   //more context
    return ( <AuthContext.Provider value={{ auth, setAuth }}> {children} </AuthContext.Provider> );
}

const useAuth = () => useContext(AuthContext);

export default useAuth;