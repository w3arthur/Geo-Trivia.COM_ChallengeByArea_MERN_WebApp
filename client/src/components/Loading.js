import { colors } from '../Config'
import { CircularProgress, Box } from "@mui/material";
export default function Loading(){
    return (<>
    <Box component="div" style={{position:'fixed', zIndex: 1303, left: '50%', top: '50%', textAlign: 'center'}} >
        <CircularProgress size={100} />
        <br/>
        <Box style={{backgroundColor: colors.loadingBackgroundColor, borderRadius: 20}}>Loading...</Box>
    </Box>
    </>);
}