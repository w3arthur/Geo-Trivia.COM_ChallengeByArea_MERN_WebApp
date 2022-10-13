import React from "react";
import { Box } from "@mui/material";
import LanguageBar from "./LanguageBar";
import { useTranslation } from "../Hooks"
import { colors } from '../Config';
import { logo } from '../Images';

export default function Logo () {
 const logoStyle= { backgroundImage: `url(${logo})`
    , backgroundSize: {xs: '600px 140%', sm:'100% 100%', lg: '1400px 100%'}
    , backgroundColor: colors.logoLargeScreenBackgroundColor
    , height: {xs:'25vh', sm: '35vh'}
    , minHeight: {xs: '200px',sm:'300px', lg:'350px'}
    , minWidth: '250px'
    , maxWidth: '100vw'
    , backgroundRepeat: 'no-repeat'
    , backgroundPosition: {xs: '48% 50%',sm:'center center'}
    , borderRadius: '5px'
    , margin: '4px 4px' }
 const render = () => (<>
  <Box sx={{ ...logoStyle}} >
      <LanguageBar sx={{position: 'absolute', right: '0', paddingRight: '10px', paddingTop: '10px', color: colors.languageIconColor}} />
  </Box>
 </>);
 

return render();}