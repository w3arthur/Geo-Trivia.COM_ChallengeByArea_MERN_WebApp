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

const geoData = { "type": "FeatureCollection",
  "features": [
    { "type": "Feature",
      "geometry": { "type": "Point", "coordinates": [35.3106392, 32.6943036] },
      "properties": { "id":"01", "name": "Nof Haglil", "details": "" }
    },
  ]
};


export default function Location() {
  const { t } = useTranslation();

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


    <FromListPopup open={openFromListPopup} handleClose={handleClose} aria-labelledby="customized-dialog-title" />
    <FromMapPopup open={openFromMapPopup} handleClose={handleClose} aria-labelledby="customized-dialog-title" />
    <YourLocationPopup open={openYourLocationPopup} handleClose={handleClose} aria-labelledby="customized-dialog-title" />

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

function FromListPopup({open, handleClose}){
  return(<PopUP open={open} handleClose={handleClose} title="Choose Location from list" handleSubmit={()=>{ }} submitText="Register">
  </PopUP>)
}






function FromMapPopup({open, handleClose}){
      const viewport = useRef({
        latitude: 32.6943036,
        longitude: 35.3106392,
        zoom: 13
    });

    const mapRef = useRef(null);

    const moveTo = (coordinates) => {
            mapRef.current.easeTo({
            center: coordinates, //[,]
            zoom: 13,
            duration: 500
        });  
    }

    const [selectedPark, setSelectedPark] = useState(null);
    const [yourErea, setYourErea] = useState(null);

    useEffect(() => { (async() => { //on esc pres
        const listener = e => { if (e.key === "Escape") { setSelectedPark(null); } };
        window.addEventListener("keydown", listener);
        return () => { window.removeEventListener("keydown", listener); };
    })() });

    useEffect(()=>{ //onload set poit
        setSelectedPark(geoData.features[0]);
    },[])
  return(<PopUP open={open} handleClose={handleClose} title="Choose Location from map" handleSubmit={()=>{ }} submitText="Register">





    <ReactMapGL ref={mapRef} initialViewState={viewport.current} doubleClickZoom={ true }  scrollZoom = { true }
    mapStyle="mapbox://styles/mapbox/streets-v9" style={{width: 600, height: 400}}
    >
        {geoData.features.map(park => (
          <Marker key={park.properties.id} latitude={park.geometry.coordinates[1]} longitude={park.geometry.coordinates[0]}>
            <button className="marker-btn" onClick={e => {e.preventDefault();setSelectedPark(park);setYourErea(null); moveTo(park.geometry.coordinates); }}  style={{width:25,height:25}} >
              <img src={markerImage} alt="x" style={{width:'100%',height:'100%'}} />
            </button>
          </Marker>
        ))}

        {selectedPark  ? (
          <Popup zoom={13} latitude={selectedPark.geometry.coordinates[1]} longitude={selectedPark.geometry.coordinates[0]} onClose={() => { setSelectedPark(null); }} >
            <div>
              <h2>{selectedPark.properties.name}</h2>
              <p>{selectedPark.properties.details}</p>
            </div>
          </Popup>
        ) : null}

        {yourErea && yourErea!==null ?  (
                <Popup latitude={yourErea[1]} longitude={yourErea[0]} onClose={() => { setYourErea(null); }} >
                    <div> <p>{yourErea[1]+', '}<br />{yourErea[0]}</p> </div>
                </Popup>
        )  : null}
    </ReactMapGL>

    <div> Selected: { selectedPark? selectedPark?.properties?.id+' '+selectedPark?.properties?.name+' '+JSON.stringify(selectedPark?.geometry?.coordinates) : JSON.stringify(yourErea) } </div>

    <div>
        <select  onChange={(e) => { if(e.target?.value) {
                        const point = geoData.features?.find((x) => x.properties?.id === e.target.value);
                        setSelectedPark( point ); setYourErea(null); moveTo(point.geometry.coordinates);              
        } }} >
            <option > select area</option>
            {geoData.features?.map((data) => (<option key={data.properties?.id} value={data.properties?.id}  >{data.properties?.name}</option>) )}
        </select>
        
      <button type="button" onClick={e => { e.preventDefault(); 
          (async() => {
            const area = await getCoords();
            setYourErea(area); setSelectedPark(null); moveTo(area);
          })()
        }}>
            Your area
        </button>
    </div>




  </PopUP>)
}






function YourLocationPopup({open, handleClose}){
  return(<PopUP open={open} handleClose={handleClose} title="Your Location"  handleSubmit={()=>{ }} submitText="Register">

  </PopUP>)
}








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

