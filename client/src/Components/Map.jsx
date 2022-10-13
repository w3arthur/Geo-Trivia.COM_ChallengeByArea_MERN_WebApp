/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useEffect, useState } from "react";
import { Box, Button, Typography, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import * as Icons from "@mui/icons-material/"; 
import ReactMapGL, { Marker, Popup/*, flyto*/ } from "react-map-gl";
import mapboxgl from 'mapbox-gl';
import { marker } from '../Images';
import { getCoords } from '../Api';
import { tokens, map } from '../Config';
import { useTranslation } from '../Hooks';

import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = tokens.mapboxgl; //pk.eyJ1Ij.....4YSpN5Dg
const zoom = map.zoom;  //6
const transferDuration = map.transferDuration;

export default function Map({geoData, show, height, minHeight, settings}){
    const { t } = useTranslation();
    const  { coordinates, setCoordinates , mapSelectedCountry, setMapSelectedCountry , mapYourCoordinates, setMapYourCoordinates } = settings;

    const [areaPing, setAreaPing] = useState(true);

    useEffect(()=>{ if(!coordinates || !coordinates[0]) {
        //setMapSelectedCountry( null ); 
        (async() => {await setMapSelectedCountry( geoData[0] ); })()
        setCoordinates( geoData[0].location?.coordinates ); 
        setMapYourCoordinates(null);
    } }, []) //starter sellect//onload set poit

    const viewport = useRef({ latitude:  coordinates[1] || geoData[0].location?.coordinates[1] || 0 , longitude:  coordinates[0] || geoData[0].location?.coordinates[0] || 0 , zoom: zoom });
    const mapRef = useRef(null);
    const moveTo = (coordinates) => { mapRef.current.easeTo({ center: coordinates /*[,]*/ , zoom: zoom , duration: transferDuration }); }

    const [select, setSelect] = useState('');

const render = () => (<>
{/* The List /: button set by your area (getCoords) */}
<Box sx={{textAlign: 'center'}} >
    {show === 'list' ? (
        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel>{t("SelectArea")}</InputLabel>
            <Select value={select} onChange={handleSelect} label={t("SelectArea")} >
                <MenuItem value=""> <em>{t("Area Selector")}</em> </MenuItem>
                {geoData?.map((data) => (<MenuItem key={data?._id} value={data?._id}  >{t(data?.area)}</MenuItem>) )}
            </Select>
            
        </FormControl>)
    : show === 'yourLocation' ? (
        <Button fullWidth startIcon={<Icons.Public/>} variant='contained' size= 'small' onClick={e => { e.preventDefault(); (async() => { const area = await getCoords(); setAreaYourCoords(area);  })() }}>
            {t("Set your area")}
        </Button> )
    : (<></>) }
</Box>
{/* The Map with markers */}
<ReactMapGL mapboxApiAccessToken={tokens.mapboxgl} ref={mapRef} initialViewState={viewport.current} doubleClickZoom={ true }  scrollZoom = { true } mapStyle="mapbox://styles/mapbox/streets-v9" style={{width: '100%', height: height, minHeight: minHeight}} >
    {geoData.map( (data) => (
        <Marker key={data._id} latitude={data.location?.coordinates[1]} longitude={data.location?.coordinates[0]}>
            <Box onClick={ (e) => { e.preventDefault(); setTimeout( () => { setAreaSelectedCountry(data) }, 100) }}  sx={{width:45,height:45, cursor: 'pointer'}} > <img src={marker} alt="x" style={{width:'100%',height:'100%'}} /> </Box>
        </Marker> ) )}
    {areaPing && mapSelectedCountry  ? (
        <Popup closeButton= {false}  latitude={mapSelectedCountry.location?.coordinates[1]} longitude={mapSelectedCountry.location?.coordinates[0]} onClose={(e) => {  setAreaSelectedCountry(null) }}>
            <Typography variant="map" > {t(mapSelectedCountry.area)}<br /> </Typography>
        </Popup>
    ) : null }
    {areaPing && mapYourCoordinates && mapYourCoordinates !== null ?  (
        <Popup closeButton= {false} latitude={mapYourCoordinates[1]} longitude={mapYourCoordinates[0]} onClose={(e) => {  setAreaSelectedCountry(null) }} >
            <Typography variant="map"> You're Here </Typography>
        </Popup>
    ) : null}
</ReactMapGL>
{/* Coordinates result */}
<Box> { mapSelectedCountry? t(mapSelectedCountry?.area)+' '+JSON.stringify(mapSelectedCountry?.location?.coordinates) : JSON.stringify(mapYourCoordinates) } </Box>
</>);


function setAreaYourCoords(area){ 
    if(area === null){setAreaPing(false); return;}
    setAreaPing(true);
    setMapSelectedCountry(null);
    setMapYourCoordinates(area);
    setCoordinates( area );
    moveTo(area);
}

async function setAreaSelectedCountry(point){ 
    if(point === null){setAreaPing(false); return;}
    setAreaPing(true);
    const coordinates = point.location?.coordinates ;
    setMapYourCoordinates(null);
    setMapSelectedCountry( point ); 
    setCoordinates( coordinates );
    moveTo(coordinates);
}

const handleSelect = (event) => {
    viewport.current = {};
    setSelect(event.target.value);
    const point = geoData?.find((x) => x._id === event.target.value);
    (async() => {setAreaSelectedCountry(point);  })()
};


return render();}
