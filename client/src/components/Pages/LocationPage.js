import React, {useRef, useEffect, useState} from "react";
import { Grid, Card, Chip , Paper, Link, Box, Button, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import monkeyLeft from './images/monkeyLeft.png';
import monkeyRight from './images/monkeyRight.png';
import globe from './images/globe.png';

import PopUP from '../popup/PopUp';

import mapboxgl from 'mapbox-gl';
import ReactMapGL, { Marker, Popup, flyto } from "react-map-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import markerImage from './images/marker.png';
mapboxgl.accessToken = "pk.eyJ1IjoibGVnb3BhcnQiLCJhIjoiY2wxeG55d3QwMDRqMTNjbHB6bTlraGo3cCJ9.-FqKk-KjHlpmJ54YSpN5Dg";



export default function Location() {
  const { t } = useTranslation();

  const [coordinates, setCoordinates] = useState( [35.3106392, 32.6943036] ); //starting points
  const [mapSelectedCountry, setMapSelectedCountry] = useState( null );
  const [mapYourCoordinates, setMapYourCoordinates] = useState( null );

  const settings = {
    coordinates, setCoordinates
    , mapSelectedCountry, setMapSelectedCountry
    , mapYourCoordinates, setMapYourCoordinates
  }

  const [openFromListPopup, setOpenFromListPopup] = useState(false);
  const [openFromMapPopup, setOpenFromMapPopup] = useState(false);
  const [openYourLocationPopup, setOpenYourLocationPopup] = useState(false);

  const handleClose = () => { setOpenFromListPopup(false); setOpenFromMapPopup(false); setOpenYourLocationPopup(false); };
  const handleClick_openFromListPopup = () => { setOpenFromListPopup(true); };
  const handleClick_openFromMapPopup = () => { setOpenFromMapPopup(true); };
  const handleClick_yourLocationPopup = () => { setOpenYourLocationPopup(true); };

  return (<>
    <Typography variant="h1" sx={{ fontWeight: "bold" }}> {t("Location")} </Typography>
    <Grid container>

      <Selection onClick={handleClick_openFromListPopup} leftMonkey>Choose Location <br /> from list</Selection>

      <Selection onClick={handleClick_openFromMapPopup} rightMonkey>Choose Location <br /> from map</Selection>

      <Selection onClick={handleClick_yourLocationPopup} leftBottomMonkey>Your <br /> Location</Selection>

    </Grid>



<PopUP open={openFromListPopup} handleClose={handleClose} title="Choose Location from list" handleSubmit={()=>{ }} submitText="Set Area">
  <Map settings={settings} height='45vh' getCoordinates={coordinates} setCoordinates={setCoordinates} />
</PopUP>

{/* Location From Map */}
<PopUP open={openFromMapPopup} handleClose={handleClose} title="Choose Location from map" handleSubmit={()=>{ }} submitText="Set Area">
      <Map settings={settings} height='45vh' getCoordinates={coordinates} setCoordinates={setCoordinates} />
      <button type="button" onClick={e => { e.preventDefault();
         ( () => { setCoordinates([88, 88])
           })() }}>
            ******
      </button>
</PopUP>


    {/* Your Location GPS */}
<PopUP open={openYourLocationPopup} handleClose={handleClose} title="Your Location"  handleSubmit={()=>{ }} submitText="Set Area">
    <Map settings={settings} height='45vh' getCoordinates={coordinates} setCoordinates={setCoordinates} />
</PopUP>

  </>);
}

const getCoords = async () => {  //gps
    async function userCoord(){
        const pos = await new Promise( (resolve, reject) => { navigator.geolocation.getCurrentPosition(
            resolve , reject, { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        ); } );
        return [ pos.coords.longitude, pos.coords.latitude ];
    }
    return await userCoord().catch( (err) => { console.error(err); throw new Error();} ); //.than
};







function Selection(props){
  const {leftMonkey, leftBottomMonkey, rightMonkey} = props;
  const additionStyle = leftMonkey? ({marginLeft: 'auto', marginTop: '30vh'}) 
    : rightMonkey? ({marginRight: 'auto', marginTop: '25vh'})
    : leftBottomMonkey? ({marginLeft: 'auto', marginTop: '20vh'})
    : null;
  const styleImage = {display: 'block', width: '75%', maxHeight: '75%', maxWidth: '75%', ...additionStyle};

  return(<>
      <Grid item sm={4} sx={{p:2, display: { xs: 'none', sm: 'block' }}}>
          <SelectionValue onClick={props.onClick}>{props.children}</SelectionValue>
      </Grid>

      {leftMonkey || leftBottomMonkey  ? 
      <SelectionImageGrid onClick={props.onClick}>
        <img alt="monkeyLeft" src={monkeyLeft} style={styleImage}/>
      </SelectionImageGrid> : null}

      <Grid item xs={8} sx={{p:1 ,height: '100%' ,display: { xs: 'block', sm: 'none' }}}>
        <SelectionValue onClick={props.onClick}>{props.children}</SelectionValue>
      </Grid>

      {rightMonkey ? (
        <SelectionImageGrid onClick={props.onClick}>
            <img alt="monkeyRight" src={monkeyRight} style={styleImage} />
        </SelectionImageGrid>
      ) : (<></>)}
      
  </>);
}

function SelectionImageGrid(props){
  return(<>
    <Grid item onClick={props.onClick} xs={4} sx={{height: '100%',display: { xs: 'block', sm: 'none' }}}>
      {props.children}
    </Grid>
  </>);
}

function SelectionValue({onClick, children, sx ,...props}){
  return(<>

      <Paper {...props} className="select"  onClick={ onClick } sx={{height: '50vh', minHeight: {sm:'250px', md: '300px'} , 
      backgroundImage: `url(${globe})`,backgroundRepeat: 'no-repeat', backgroundPosition: '20% 44%', backgroundSize: '140% 140%',  ...sx}} elevation={3}>

        <Typography variant="h2" color="secondary" sx={{mt: 8,fontSize:{xs:'24pt', md: '38pt'}}}>{children}</Typography>
            
      </Paper>
  
  </>);
}



const geoData = 
   [
    { id:"11", coordinates: [35.3248, 32.7115], country: "Israel", area:  "Nof Haglil" }
    , { id:"22", coordinates: [34.9896, 32.7940], country: "Israel", area:  "Haifa" }
  ]
;



function Map({height, settings}){

  const  {
    coordinates, setCoordinates
    , mapSelectedCountry, setMapSelectedCountry
    , mapYourCoordinates, setMapYourCoordinates
  } = settings;


      const zoom = 6;
      const viewport = useRef({
        latitude:  coordinates[1] || 0
        , longitude:  coordinates[0] || 0
        , zoom: zoom
      });
 
    const mapRef = useRef(null);
    const moveTo = (coordinates) => {
            mapRef.current.easeTo({
            center: coordinates, //[,]
            zoom: zoom,
            duration: 500
        });
    }

    useEffect(() => { (() => { //on esc pres
        const listener = e => { if (e.key === "Escape") { setMapSelectedCountry(null); } };
        window.addEventListener("keydown", listener);
        return () => { window.removeEventListener("keydown", listener); };
    })() });


    React.useEffect(()=>{ 
      console.log('coordinates', coordinates);
      console.log('mapYourCoordinates', mapYourCoordinates);
      console.log('mapSelectedCountry' ,mapSelectedCountry);

      
      if(!coordinates || !coordinates[0]) setMapSelectedCountry(geoData[0]);  //starter sellect
      else(setTimeout( () =>  moveTo(coordinates)) )

      // else if(mapSelectedCountry){
      //   if(coordinates && (!mapYourCoordinates && !mapSelectedCountry)) {setMapYourCoordinates(coordinates); moveTo(coordinates)}
      // }
      
        },[]) //onload set poit

    return (<>

    <ReactMapGL ref={mapRef} initialViewState={viewport.current} doubleClickZoom={ true }  scrollZoom = { true } mapStyle="mapbox://styles/mapbox/streets-v9" style={{width: '100%', height: height}} >
        {geoData.map( (data) => (
          <Marker key={data.id} latitude={data.coordinates[1]} longitude={data.coordinates[0]}>
            <Box className="marker-btn" onClick={ (e) => {e.preventDefault();
            
            setMapSelectedCountry(null);
            setTimeout( () => {
                  setMapSelectedCountry(data);setCoordinates(data.coordinates);setMapYourCoordinates(null); moveTo(data.coordinates);
                }, 100) }}  sx={{width:45,height:45}} > <img src={markerImage} alt="x" style={{width:'100%',height:'100%'}} /> </Box>
               
          

          </Marker>
        ))}

        {mapSelectedCountry  ? (
          <Popup  latitude={mapSelectedCountry.coordinates[1]} longitude={mapSelectedCountry.coordinates[0]} onClose={(e) => {   }}>
            <div><h2  >{mapSelectedCountry.area}</h2><p></p></div>
          </Popup>
        ) : null }

        {mapYourCoordinates && mapYourCoordinates !== null ?  (
                <Popup latitude={mapYourCoordinates[1]} longitude={mapYourCoordinates[0]} onClose={(e) => {  }} >
                    <div><h2   > You Here? </h2><p></p></div>
                </Popup>
        )  : null}
    </ReactMapGL>

    <div> Selected: { mapSelectedCountry? mapSelectedCountry?.id+' '+mapSelectedCountry?.area+' '+JSON.stringify(mapSelectedCountry?.coordinates) : JSON.stringify(mapYourCoordinates) } </div>

    <div>
        <select  onChange={(e) => { if(e.target?.value) { 
          const point = geoData?.find((x) => x.id === e.target.value);
          
          
           setMapSelectedCountry( point ); setCoordinates( point.coordinates ); setMapYourCoordinates(null); moveTo(point.coordinates); } }} >

            <option > select area</option>
            {geoData?.map((data) => (<option key={data?.id} value={data?.id}  >{data?.area}</option>) )}
        </select>
        
      <button type="button" onClick={e => { e.preventDefault(); (async() => { const area = await getCoords();
        setMapYourCoordinates(area); setCoordinates( area ); setMapSelectedCountry(null); moveTo(area); })() }}>
            Your area
      </button>
    </div>
    </>);
}
