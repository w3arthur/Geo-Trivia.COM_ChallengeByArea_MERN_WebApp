import React, {useState, createContext, useContext, useEffect} from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(
        
       // {}
        {"location":{"type":"Point","coordinates":[35.2137,31.7683]},"image":"","_id":"6264478758553a409a2e0ed1","schemaVersion":1,"name":"Arthur","email":"legopart@gmail.com","role":[1000],"language":"english","currentQuestion":-1,"__v":0,"answeredQuestions":21,"totalScore":21,"expertAreas":[{"_id":"626421557089c1bf06a8dacd","country":"Israel","area":"Tel Aviv"},{"_id":"6264206e7089c1bf06a8daac","country":"Israel","area":"Nof Hagalil"}],"accessToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjI2NDQ3ODc1ODU1M2E0MDlhMmUwZWQxIiwiZW1haWwiOiJsZWdvcGFydEBnbWFpbC5jb20iLCJpYXQiOjE2NTE2ODM4NzgsImV4cCI6MTY1MTcyNzA3OH0.H2X1J6xP3YlS_To3ej9RscIbYbCJobMp2Cav2cLWdbg"}
        
        );
    useEffect(()=> console.log('auth' ,auth) );
    //const [auth, setAuth] = React.useState({});   //more context
    return ( <AuthContext.Provider value={{ auth, setAuth }}> {children} </AuthContext.Provider> );
}

const useAuth = () => useContext(AuthContext);

export default useAuth;