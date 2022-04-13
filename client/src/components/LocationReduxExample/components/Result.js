import React from "react";
import { useSelectorWeather } from '../reducers'

export default function Result () {
        //const setWeather = useDispatch();
        let weather = useSelectorWeather();
        const {location, temperature, humidity} = weather.result;
        return (<div>
        Result: <br />
        location: {location}<br />
        temperature: {temperature}<br />
        humidity: {humidity}<br />
        </div>);
}