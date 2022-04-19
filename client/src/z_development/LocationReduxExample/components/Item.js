import React from "react";

import {loadData}  from '../api';
import { useWeatherDispatch } from '../reducers';
import { useLocationContext } from '../context';

import Result from './Result'

export default function Items () {

    const locationContext = useLocationContext();

    const weatherDispatch = useWeatherDispatch();
    const setData = async() => {
        const result = await loadData(locationContext.location);
        if (!result) {alert('Wrong input!');return;}
        try{
            const data = {
                location : result.location.name
                , temperature: result.current.temp_c
                , humidity: result.current.humidity
            }
            const {location, temperature, humidity} = data;
            weatherDispatch.AddWeather(location, temperature, humidity);    //(data)
        }catch(e){}
    }

    return (<>
    <input type="text" value={locationContext.location}  onChange={(e) => {
        //locationRedux.dispatch(SetLocation(e.target.value));
        locationContext.SetLocation(x => x = e.target.value);
        }}/>
    <button onClick={async() => { setData() }}>Add</button>
    <br />
    <Result />
    </>);
}
 