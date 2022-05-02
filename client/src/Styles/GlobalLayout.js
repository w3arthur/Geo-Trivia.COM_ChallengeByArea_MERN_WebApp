import { Outlet } from "react-router-dom"
import {createTheme, ThemeProvider, colors, Container /*, Typography, ButtonGroup, Button, TextField, Grid, Box*/ } from '@mui/material';

export default function Layout ({children}) { return ( <main>
   <MuiStyle> {children} </MuiStyle>
</main>);}


function MuiStyle({children}){
  const mainColor = `#FFA500`;
  const mainColorLight = `#FCE9D9FF`;
  const mainColorLighter = `#FFFBF5`;
  const mainColorDark = `#E39602`;
  const mainColorText1 = `#edb200`;
  const mainColorText2 = `#e0b002`;
  const mainColorText3 = `#8c6e00`;
  const purple = `#6c059c`;
  const purple2 = colors.deepPurple[500];

  const fontSize = '24pt';
  const fontSizeBig = '29pt';
  const fontSizeBigger = '32pt';
  const fontSizeBiggest = '42pt';
  const fontSizeBiggest2 = '36pt';
  const fontSizeSmall1 = '21pt';
  const fontSizeSmall2 = '18pt';
  const fontSizeSmaller1 = '16pt';
  const fontSizeSmaller2 = '14pt';




  const white = `#ffffff`;
  const shadow = `#888888`;
  const shadowLight = `#CCCCCC`;

  const theme = createTheme({

    breakpoints: {
      values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536, },//set for media next (by value!)
      },
    palette: {
      primary:{
        main: `${mainColor}`
      },
      secondary:{
        main: `${purple}`
      }
/*
      , error:{
        //
      }
      , warning:{
        //
      }
      , info:{
        //
      }
*/
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
        , styleOverrides: {
          root:{
            backgroundColor: white
            , m: 2
            , borderRadius: '10px'
            , minHeight:'100%'
            , minWidth: '100%'
            , height: 'auto'
            , width: 'auto'
            , '.answerValue' : { //set className!
              whiteSpace: 'normal', width: '100%', minWidth: '42vw'
              , '@media (max-width:900px)': {minWidth: '85vw'}
              }
            ,borderWidth: 1
            , boxShadow: `1px 2px 0px 0px ${shadow}`  
            , "&:hover ":{
              backgroundColor: `${mainColorLighter} ! important`
             // , '.MuiAvatar-root': { backgroundColor: `${mainColorLighter}` }
              }
            , '&:active': {
              boxShadow: 'none'
              , color: `${mainColor}`
              }
            , '&:focus, &:active': {
              backgroundColor: `${mainColorLight} ! important`
              , '.MuiAvatar-root': {backgroundColor: `${white} ! important`, color: `${shadow}` }
              }
          }
        }

      }
      , MuiAvatar:{
        styleOverrides: {
          root:{
            width: '44px  !important' , height: '44px !important'
            , zIndex: 1
            , backgroundColor: white
            , border: `5px solid ${mainColor}`
            , '.answerNumber': {fontSize: fontSize} //set className!
            , textShadow: `0px 1px ${shadow}`
            , boxShadow: `2px 1px 0px 0px ${shadow}`
            }
        }

      }
      , MuiPaper: {
        styleOverrides: {
          root: { 
            border: `3px solid ${shadowLight}  ! important`
            , "&:hover.select":{
              cursor: 'pointer'
              , backgroundColor: `${mainColorLighter} ! important`
              , border: `3px solid ${mainColor}  ! important`
              }
            , '&:active.select': {
              boxShadow: 'none'
              }
            , '&:focus.select, &:active.select': {
                backgroundColor: `${white} ! important`
                , border: `3px solid ${mainColor}  ! important`
              }
          }
        }
      }
      , MuiDialog:{
            defaultProps: {
                PaperProps: {
                  sx: {
                      border: `3px solid ${mainColor}  ! important`
                  }
                }
            }
        }
      
      , MuiGrid: {
        styleOverrides: {
          root: {
            
          }
        }
      }
      , MuiTypography:{
                      styleOverrides: {
          root: { 
                      
          }
        }

      }
      , MuiButton: {
        styleOverrides: {
          root: { 
            "&:hover.MuiButton-containedPrimary":{backgroundColor: mainColorDark },

            marginBottom: 8
            , fontSize: 20
            } 
          }
          , defaultProps:{ size: 'large'  }

        }
      
      , MuiTextField: {
        styleOverrides: {
          root: { 
            backgroundColor: white
            , input: {
                color: `${mainColorText3}`
              , fontSize: 25
            }
             , marginTop: 14
             , marginBottom: 14
            }  //decide if change the text inside the field
          }
          , map : {
            
          }
        }

      , MuiCheckbox: {
        defaultProps:{ color: 'primary', }
        , root: {  }
        ,
        }

    },
  });
  return(<ThemeProvider theme={theme}>{children} </ThemeProvider>);
}

