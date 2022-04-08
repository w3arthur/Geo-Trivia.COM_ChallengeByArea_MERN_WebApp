import React from "react";

const AuthContext = React.createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = React.useState({});
    //const [auth, setAuth] = React.useState({});   //more context
    return ( <AuthContext.Provider value={{ auth, setAuth }}> {children} </AuthContext.Provider> );
}

const useAuth = () => React.useContext(AuthContext);

export default useAuth;