import React, {useState, createContext, useContext, useEffect} from "react";
import Loading from '../Components/Loading'
import { Snackbar, Alert } from "@mui/material";
const LoadingContext = createContext({});

export const LoadingProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [axiosloading, setAxiosLoading] = useState(false);

    const [alertMessage, setAlert] = useState('');

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAlert('');
    };

    useEffect(()=> console.log('loading' ,loading) );
    //const [auth, setAuth] = React.useState({});   //more context
    return ( <><LoadingContext.Provider value={{ setAlert, setAlert, loading, setLoading, axiosloading, setAxiosLoading }}>
        <div style={{display: loading || axiosloading ? 'block': 'none'}}><Loading/></div>
        {children}
       <Snackbar open={alertMessage === '' ? false : true} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          {alertMessage || Error}
        </Alert>
      </Snackbar>
    </LoadingContext.Provider></>  );
}

const useLoading = () => useContext(LoadingContext);

export default useLoading;