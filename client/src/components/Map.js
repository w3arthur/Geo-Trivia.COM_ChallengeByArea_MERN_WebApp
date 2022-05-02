import React, {useRef, useEffect, useState} from "react";
import { Grid, Card, Chip , Paper, Link, Box, Button, Typography, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import * as Icons from "@mui/icons-material/"; 
import ReactMapGL, { Marker, Popup/*, flyto*/ } from "react-map-gl";
import mapboxgl from 'mapbox-gl';

import {marker} from '../Images';
import {getCoords} from '../Api'

mapboxgl.accessToken = "pk.eyJ1IjoibGVnb3BhcnQiLCJhIjoiY2wxeG55d3QwMDRqMTNjbHB6bTlraGo3cCJ9.-FqKk-KjHlpmJ54YSpN5Dg";


export default function Map({geoData, show, height, minHeight, settings}){
    const  { coordinates, setCoordinates , mapSelectedCountry, setMapSelectedCountry , mapYourCoordinates, setMapYourCoordinates }
        = settings;

    const zoom = 6;

    function setAreaYourCoords(area){ setMapYourCoordinates(null); setMapYourCoordinates(area); setCoordinates( area ); setMapSelectedCountry(null); moveTo(area); }

    function setAreaSelectedCountry(point){ setMapSelectedCountry( null ); setMapSelectedCountry( point ); setCoordinates( point.location?.coordinates ); setMapYourCoordinates(null); moveTo(point.location?.coordinates); }


    useEffect(()=>{ 
        if(!coordinates || !coordinates[0]) {
            //setMapSelectedCountry( null ); 
            setMapSelectedCountry( geoData[0] );
            setCoordinates( geoData[0].location?.coordinates ); 
            setMapYourCoordinates(null); 
             
            
             } //starter sellect
        //else setTimeout( () =>  moveTo(coordinates)) ;
        // eslint-disable-next-line react-hooks/exhaustive-deps
         }, []) //onload set poit

    const viewport = useRef({ latitude:  coordinates[1] || geoData[0].location?.coordinates[1] || 0 , longitude:  coordinates[0] || geoData[0].location?.coordinates[0] || 0 , zoom: zoom });

    const mapRef = useRef(null);
    const moveTo = (coordinates) => { mapRef.current.easeTo({ center: coordinates /*[,]*/ , zoom: zoom , duration: 500 }); }




    const [select, setSelect] = React.useState('');
    const handleSelect = (event) => {
        setSelect(event.target.value);
        const point = geoData?.find((x) => x._id === event.target.value);
        setAreaSelectedCountry(point); 
        };

return (<>
<Box sx={{textAlign: 'center'}} >
    {show === 'list' ? (
            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel>Select Area</InputLabel>
                <Select value={select} onChange={handleSelect} label="SelectArea" >
                    <MenuItem value=""> <em>Area Selector</em> </MenuItem>
                    {geoData?.map((data) => (<MenuItem key={data?._id} value={data?._id}  >{data?.area}</MenuItem>) )}
                </Select>
            </FormControl>)
        : show === 'yourLocation' ? (
            <Button startIcon={<Icons.Public/>} variant='contained' size= 'small' onClick={e => { e.preventDefault(); (async() => { const area = await getCoords(); setAreaYourCoords(area);  })() }}>
                Your area
            </Button> )
        : (<></>) }
</Box>
<ReactMapGL ref={mapRef} initialViewState={viewport.current} doubleClickZoom={ true }  scrollZoom = { true } mapStyle="mapbox://styles/mapbox/streets-v9" style={{width: '100%', height: height, minHeight: minHeight}} >
    {geoData.map( (data) => (
        <Marker key={data._id} latitude={data.location?.coordinates[1]} longitude={data.location?.coordinates[0]}>
            <Box onClick={ (e) => { e.preventDefault(); setTimeout( () => { setAreaSelectedCountry(data) }, 100) }}  sx={{width:45,height:45, cursor: 'pointer'}} > <img src={marker} alt="x" style={{width:'100%',height:'100%'}} /> </Box>
        </Marker> ) )}

    {mapSelectedCountry  ? (
        <Popup closeButton= {false}  latitude={mapSelectedCountry.location?.coordinates[1]} longitude={mapSelectedCountry.location?.coordinates[0]} onClose={(e) => {   }}>
            <Typography variant="map" > {mapSelectedCountry.area} </Typography>
        </Popup>
    ) : null }

    {mapYourCoordinates && mapYourCoordinates !== null ?  (
        <Popup closeButton= {false} latitude={mapYourCoordinates[1]} longitude={mapYourCoordinates[0]} onClose={(e) => {  }} >
            <Typography variant="map"> You're Here </Typography>
        </Popup>
    ) : null}
</ReactMapGL>

<Box> { mapSelectedCountry? mapSelectedCountry?.area+' '+JSON.stringify(mapSelectedCountry?.location?.coordinates) : JSON.stringify(mapYourCoordinates) } </Box>

</>);
}
