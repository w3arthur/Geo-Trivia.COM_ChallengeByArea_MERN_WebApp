const getCoords = async() => {  //gps
    async function userCoord(){
        const pos = await new Promise( (resolve, reject) => { navigator.geolocation.getCurrentPosition(
            resolve , reject, { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        ); } );
        return [ pos.coords.longitude, pos.coords.latitude ];
    }
    return await userCoord().catch( (err) => { console.error(err); throw new Error();} ); //.than
};

export default getCoords;