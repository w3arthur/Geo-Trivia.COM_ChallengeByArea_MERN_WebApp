import { CircularProgress, Box } from "@mui/material";
import { useTranslation } from '../Hooks';
import { colors } from '../Config';
export default function Loading(){
    const { t } = useTranslation();
const render = () => (<>
{/* Cover Screen Area */}
<Box sx={{backgroundColor: colors.loading.screenBackground, position:'fixed', width: '100vw', height: '100vh', zIndex: 1303}}></Box>
<Box component="div" sx={{position:'fixed', zIndex: 1303, left: '50%', top: '50%', textAlign: 'center'}} >
    <CircularProgress size={100} />
    <br/>
    <Box style={{backgroundColor: colors.loading.textBackGround, borderRadius: 20}}>{t("Loading...")}</Box>
</Box>
</>);
return render();}