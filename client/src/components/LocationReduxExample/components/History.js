
import React from "react";
import { useSelectorWeather } from '../reducers'

export default function History() {
        //const setWeather = useDispatch();
         let weather = useSelectorWeather();
        return (<>
        History:<br />
        {weather.history.map( (x, i) => {return <div key={i}>
            location: {x.location},
            temperature: {x.temperature},
            humidity: {x.humidity}<br />
            </div>})}
        </>);
    
}