import { CircularProgress } from "@mui/material";
export default function Loading(){
    return (<>
        <div style={{position:'fixed', zIndex: 1301, left: '50%', top: '50%', textAlign: 'center'}} >
            <CircularProgress size={100} />
            <br/>
            <div style={{backgroundColor: '#ffffff', borderRadios: 20 }}>Loading...</div>
        </div>
    </>);
}