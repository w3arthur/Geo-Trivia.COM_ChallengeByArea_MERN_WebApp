import mapboxgl from 'mapbox-gl';
import React, { useRef, useEffect, useState } from 'react';
import ReactMapGL, { Marker, Popup, flyto } from "react-map-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import markerImage from './marker.png';

mapboxgl.accessToken = "pk.eyJ1IjoibGVnb3BhcnQiLCJhIjoiY2wxeG55d3QwMDRqMTNjbHB6bTlraGo3cCJ9.-FqKk-KjHlpmJ54YSpN5Dg";

const geoData = { "type": "FeatureCollection",
  "features": [
    { "type": "Feature",
      "geometry": { "type": "Point", "coordinates": [35.3106392, 32.6943036] },
      "properties": { "id":"01", "name": "Nof Haglil", "details": "" }
    },
  ]
};


const getCoords = async () => {  //gps
    async function userCoord(){
        const pos = await new Promise( (resolve, reject) => { navigator.geolocation.getCurrentPosition(
            resolve , reject, { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        ); } );
        return [ pos.coords.longitude, pos.coords.latitude ];
    }
    return await userCoord().catch( (err) => { console.error(err); throw new Error();} ); //.than
};


export default function GeoLocation(){

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

return <>
    
    {/*initialViewState */}
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
</>;}

