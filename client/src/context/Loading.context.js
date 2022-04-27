import React, {useState, createContext, useContext, useEffect} from "react";
import Loading from '../Components/Loading'

const LoadingContext = createContext({});

export const LoadingProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [axiosloading, setAxiosLoading] = useState(false);
    useEffect(()=> console.log('loading' ,loading) );
    //const [auth, setAuth] = React.useState({});   //more context
    return ( <><LoadingContext.Provider value={{ loading, setLoading, axiosloading, setAxiosLoading }}><div style={{display: loading || axiosloading ? 'block': 'none'}}><Loading/></div> {children}</LoadingContext.Provider></>  );
}

const useLoading = () => useContext(LoadingContext);

export default useLoading;