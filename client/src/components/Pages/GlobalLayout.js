import { Outlet } from "react-router-dom"
import {createTheme, ThemeProvider, colors, Container/*, Typography, ButtonGroup, Button, TextField, Grid, Box*/ } from '@mui/material';

export default function Layout ({children}) { return (
    <main className="App"> 
        <MuiStyle>
                
                {children}
                <Outlet /> 
            
        </MuiStyle>
    </main>
)}



function MuiStyle({children}){
  const mainColor = `#FFA500`;
  const mainColorLight = `#FCE9D9FF`;
  const mainColorLighter = `#FFFBF5`;
  const mainColorDark = `#E39602`;
  	
  const fontSize = 24;
  const fontSizeBig = 29;
  const fontSizeBigger = 31;
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
        main: colors.blue[400]
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
      h2: { fontSize: fontSize }      
      , h3: { fontSize: fontSize }
      , h4: { fontSize: fontSizeBigger, margin:'auto', textAlign: 'center' }
      , h5: { fontSize: fontSizeBig, margin:'auto', textAlign: 'center' }
      , body2: { color: colors.deepPurple[500] }
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
              , '.MuiAvatar-root': { backgroundColor: `${mainColorLighter}` }
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
            , bottom: "50%", left: "top"
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
            , "&:hover ":{
              cursor: 'pointer'
              , backgroundColor: `${mainColorLighter} ! important`
              , border: `3px solid ${mainColor}  ! important`
              }
            , '&:active': {
              boxShadow: 'none'
              }
            , '&:focus, &:active': {
                backgroundColor: `${white} ! important`
                , border: `3px solid ${mainColor}  ! important`
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
      , MuiButton: {
        styleOverrides: {
          root: { 
            "&:hover.MuiButton-containedPrimary":{backgroundColor: mainColorDark }
            } 
          }
        }
      
      , MuiTextField: {
        styleOverrides: {
          root: { backgroundColor: white, input: {color: '#ff0000'} }  //decide if change the text inside the field
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

