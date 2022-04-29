import { CircularProgress, Box } from "@mui/material";
export default function Loading(){
    return (<>
    <Box component="div" style={{position:'fixed', zIndex: 1301,height:'100%', width:'100%', backgroundColor: '#ccddff22'}}>
        Loading...
    </Box>
    <Box component="div" style={{position:'fixed', zIndex: 1303, left: '50%', top: '50%', textAlign: 'center'}} >
        <CircularProgress size={100} />
        <br/>
        <Box style={{backgroundColor: '#ffffffaa', borderRadius: 20}}>Loading...</Box>
    </Box>
    </>);
}