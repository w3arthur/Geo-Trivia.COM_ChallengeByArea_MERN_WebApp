import { createSlice } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
// Action
//export const AddWeather=(data)=> ({type:'ADD_RESULT', payload: data});
//export const ResetWeather= ()=> ( {type:'RESET'});

const initialState = {
    result: {}
    , history: []
}

// Reducer
export const weatherReducer = createSlice({
    name: 'weatherReducer',
    initialState,
    reducers: {
        /*AddWeather: (state, action) => {
            //const arr = JSON.parse(JSON.stringify());
            state.result = {...action.payload};
            state.history = [{...action.payload}, ...state.history];
        },*/
        AddWeather: {
            reducer: (state, action) => {
                //const arr = JSON.parse(JSON.stringify());
                state.result = {...action.payload};
                state.history = [{...action.payload}, ...state.history];
            }
            , prepare: (location, temperature, humidity) => {  //prepare, can use without it
                return {
                    payload: {location, temperature, humidity}
                }
            }
        }
        , ResetWeather: (state) => { state = initialState;}
    }
});

export const useSelectorWeather = () => useSelector(s=>s.weatherReducer);
//const { ResetWeather } = weatherReducer.actions;

export const useWeatherDispatch = () => {
    const _dispatch = useDispatch();
    const {AddWeather, ResetWeather} = weatherReducer.actions;
    return ({
        AddWeather: (location, temperature, humidity) => _dispatch(AddWeather(location, temperature, humidity)) //(data)
        , ResetWeather: () =>  _dispatch(ResetWeather())
    })
};


export default weatherReducer.reducer;

/*
export default function weatherReducer(state = {result: {}, history: []}, action){
    console.log(state);
    switch(action.type)
    {
        case "ADD_RESULT":  
            const arr = JSON.parse(JSON.stringify(state.history));
            return {
                result: {...action.payload}
                , history: [{...action.payload}, ...arr]
            };
        case "RESET": return {result: {}, history: []};
        default: return state;
    }
}*/