
import {Provider} from 'react-redux';
import { configureStore } from "@reduxjs/toolkit";
import weatherReducer, {useSelectorWeather, useWeatherDispatch } from './weather.reducer';

const store = configureStore({
    reducer: {
        weatherReducer,
    }
})

const ReduxProvider = ({children}) =>
     <Provider store={store}>{children}</Provider>

export {ReduxProvider, useSelectorWeather, useWeatherDispatch}
