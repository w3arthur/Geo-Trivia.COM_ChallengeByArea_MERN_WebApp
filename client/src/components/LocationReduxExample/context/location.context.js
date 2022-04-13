import React from 'react';

const LocationContext = React.createContext();
export const useLocationContext = () => React.useContext(LocationContext);

export function LocationContextProvider({children}){
    const [location, SetLocation] = React.useState('Israel');
    function func2(){
            SetLocation();//...
    }
    return(
        <LocationContext.Provider value={{location, SetLocation, func2}}>
            {children}
        </LocationContext.Provider>
    )
}