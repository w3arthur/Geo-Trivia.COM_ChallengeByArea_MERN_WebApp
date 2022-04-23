import React, {useRef, useEffect, useState} from "react";
import { Grid, Card, Chip , Paper, Link, Box, Button, Typography } from "@mui/material";
import mapboxgl from 'mapbox-gl';
import ReactMapGL, { Marker, Popup/*, flyto*/ } from "react-map-gl";
import markerImage from '../images/marker.png';

import {getCoords} from '../../../api'

mapboxgl.accessToken = "pk.eyJ1IjoibGVnb3BhcnQiLCJhIjoiY2wxeG55d3QwMDRqMTNjbHB6bTlraGo3cCJ9.-FqKk-KjHlpmJ54YSpN5Dg";


const geoData = 
   [
    { id:"11", coordinates: [35.3248, 32.7115], country: "Israel", area:  "Nof Haglil" }
    , { id:"22", coordinates: [34.9896, 32.7940], country: "Israel", area:  "Haifa" }
  ]
;

export default function Map({height, settings}){
    const  {
    coordinates, setCoordinates
    , mapSelectedCountry, setMapSelectedCountry
    , mapYourCoordinates, setMapYourCoordinates
    } = settings;

    const zoom = 6;

    function setAreaYourCoords(area){ setMapYourCoordinates(null); setMapYourCoordinates(area); setCoordinates( area ); setMapSelectedCountry(null); moveTo(area); }

    function setAreaSelectedCountry(point){ setMapSelectedCountry( null ); setMapSelectedCountry( point ); setCoordinates( point.coordinates ); setMapYourCoordinates(null); moveTo(point.coordinates); }

    const viewport = useRef({ latitude:  coordinates[1] || 0 , longitude:  coordinates[0] || 0 , zoom: zoom });

    const mapRef = useRef(null);
    const moveTo = (coordinates) => { mapRef.current.easeTo({ center: coordinates /*[,]*/ , zoom: zoom , duration: 500 }); }

    //useEffect(() => { (() => { /*on esc pres*/ const listener = e => { if (e.key === "Escape") { setMapSelectedCountry(null); } }; window.addEventListener("keydown", listener); return () => { window.removeEventListener("keydown", listener); }; })() });

    useEffect(()=>{ 
        console.log('coordinates', coordinates);
        console.log('mapYourCoordinates', mapYourCoordinates);
        console.log('mapSelectedCountry' ,mapSelectedCountry);

        if(!coordinates || !coordinates[0]) setMapSelectedCountry(geoData[0]);  //starter sellect
        else setTimeout( () =>  moveTo(coordinates)) ;
        // eslint-disable-next-line react-hooks/exhaustive-deps
         }, []) //onload set poit

    return (<>
    <ReactMapGL ref={mapRef} initialViewState={viewport.current} doubleClickZoom={ true }  scrollZoom = { true } mapStyle="mapbox://styles/mapbox/streets-v9" style={{width: '100%', height: height}} >
        {geoData.map( (data) => (
        <Marker key={data.id} latitude={data.coordinates[1]} longitude={data.coordinates[0]}>
            <Box className="marker-btn" onClick={ (e) => { e.preventDefault(); setTimeout( () => { setAreaSelectedCountry(data) }, 100) }}  sx={{width:45,height:45}} > <img src={markerImage} alt="x" style={{width:'100%',height:'100%'}} /> </Box>
        </Marker> ) )}

        {mapSelectedCountry  ? (
        <Popup  latitude={mapSelectedCountry.coordinates[1]} longitude={mapSelectedCountry.coordinates[0]} onClose={(e) => {   }}>
            <div><h2  >{mapSelectedCountry.area}</h2><p></p></div>
        </Popup>
        ) : null }

        {mapYourCoordinates && mapYourCoordinates !== null ?  (
            <Popup latitude={mapYourCoordinates[1]} longitude={mapYourCoordinates[0]} onClose={(e) => {  }} >
                <div><h2> You're Here </h2><p></p></div>
            </Popup>
        ) : null}
    </ReactMapGL>

    <div> Selected: { mapSelectedCountry? mapSelectedCountry?.id+' '+mapSelectedCountry?.area+' '+JSON.stringify(mapSelectedCountry?.coordinates) : JSON.stringify(mapYourCoordinates) } </div>

    <div>
        <select  onChange={(e) => { if(e.target?.value) { const point = geoData?.find((x) => x.id === e.target.value); setAreaSelectedCountry(point); } }} >
            <option> select area</option>
            {geoData?.map((data) => (<option key={data?.id} value={data?.id}  >{data?.area}</option>) )}
        </select>

        <button type="button" onClick={e => { e.preventDefault(); (async() => { const area = await getCoords(); setAreaYourCoords(area);  })() }}>
            Your area
        </button>
    </div>
    </>);
}
