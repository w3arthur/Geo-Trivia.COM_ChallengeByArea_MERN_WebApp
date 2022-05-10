import {createTheme, ThemeProvider, Box } from '@mui/material';
import { colors, sizes } from '.'


export default function GlobalLayout ({children, sx}) { return ( <Box component="main" sx={{...sx}}>
   <MuiStyle> {children} </MuiStyle>
</Box>);}


function MuiStyle({children}){

const {
  mainColor
  , mainColorLight
  , mainColorLighter
  , mainColorDark
 // , mainColorText1
 // , mainColorText2
  , mainColorText3
  , purple
 // , purple2
  , white
  , shadow
  , shadowLight
} = colors.globalLayout;

const {
        fontSize
       // , fontSizeBig
        , fontSizeBigger
        , fontSizeBiggest
       // , fontSizeBiggest2
       // , fontSizeSmall1
        , fontSizeSmall2
       // , fontSizeSmaller1
        , fontSizeSmaller2
} = sizes.globalLayout;

const theme = createTheme({
breakpoints: {
  values: sizes.globalLayout.mediaDimensions,//set for media next (by value!)
  },
palette: {
  primary:{
    main: `${colors.globalLayout.primary}`
  },
  secondary:{
    main: `${colors.globalLayout.secondary}`
  }
  // , error:{ }
  // , warning:{ }
  // , info:{ }
}
, typography: {
  h1: { fontSize: fontSizeBigger, margin:'auto', textAlign: 'center', fontWeight: 'bold', textShadow: `-1px 1px ${shadow}`  }
  , h2: { fontSize:fontSizeBiggest , margin:'auto', textAlign: 'center', fontWeight: 'bold', textShadow: `-1px 1px ${shadow}`   }      
  , h3: { fontSize: fontSizeBigger , margin:'auto', textAlign: 'center', fontWeight: 'bold'}
  , h4: { fontSize: fontSize, margin:'auto', textAlign: 'center', fontWeight: 'bold' }
  , h5: { fontSize: fontSizeSmall2, margin:'auto', textAlign: 'center', fontWeight: 'bold' }
  , map: { fontSize: fontSizeSmaller2,  }
  , body1: { fontSize: fontSizeSmall2,  color: purple }
  , body2: { fontSize: fontSize,  purple }
}

, components: {
  MuiChip: {
    defaultProps:{ variant: 'outlined', }
    , styleOverrides: { root:{
        m: 2, backgroundColor: white
        , minHeight:'100%', minWidth: '100%', height: 'auto', width: 'auto'
        ,borderWidth: 1 , boxShadow: `1px 2px 0px 0px ${shadow}` 
        , '.answerValue' : { wordBreak: 'normal', whiteSpace: 'normal', width: '90%', minWidth: '42vw', '@media (max-width:900px)': {marginLeft: '-25px',minWidth: '75vw'}}
        , "&:hover ":{ backgroundColor: `${mainColorLighter} ! important` }// , '.MuiAvatar-root': { backgroundColor: `${mainColorLighter}` }
        , '&:active': { boxShadow: 'none', color: `${mainColor}` }
        , '&:focus, &:active': { backgroundColor: `${mainColorLight} ! important`, '.MuiAvatar-root': {backgroundColor: `${white} ! important`, color: `${shadow}` } }
      } }
  }
  , MuiAvatar:{
    styleOverrides: { root:{
        width: '44px  !important' , height: '44px !important'
        , zIndex: 1, backgroundColor: white
        , border: `5px solid ${mainColor}`
        , '.answerNumber': {fontSize: fontSize} //set className!
        , textShadow: `0px 1px ${shadow}`, boxShadow: `2px 1px 0px 0px ${shadow}`
      } }
    }
  , MuiPaper: {
    styleOverrides: { root: { 
        border: `3px solid ${shadowLight}  ! important`
        , "&:hover.select":{ cursor: 'pointer' , backgroundColor: `${mainColorLighter} ! important` , border: `3px solid ${mainColor}  ! important` }
        , '&:active.select': { boxShadow: 'none' }
        , '&:focus.select, &:active.select': { backgroundColor: `${white} ! important` , border: `3px solid ${mainColor}  ! important` }
      } }
  }
  , MuiDialog:{
        defaultProps: { PaperProps: { sx: { border: `3px solid ${mainColor}  ! important` } } }
    }
  , MuiGrid: {
    styleOverrides: { root: {

    } }
  }
  , MuiTypography:{
      styleOverrides: { root: { 
                  
      } }
  }
  , MuiButton: {
    styleOverrides: { root: { 
        "&:hover.MuiButton-containedPrimary":{ backgroundColor: mainColorDark }
        , marginBottom: 8 , fontSize: sizes.globalLayout.buttonFont
      } }
      , defaultProps:{ size:  sizes.globalLayout.buttonSize }
    }
  , MuiTextField: {
    styleOverrides: { root: { 
        backgroundColor: white
        , input: { color: `${mainColorText3}` , fontSize: sizes.globalLayout.inputTextField }
        , marginTop: 14 , marginBottom: 14
      } }  //decide if change the text inside the field
      }
  , MuiCheckbox: {
    defaultProps:{ color: colors.globalLayout.checkbox, }
    , root: {  }
    }
},  //components end
});

return(<ThemeProvider theme={theme}>{children} </ThemeProvider>);
}

