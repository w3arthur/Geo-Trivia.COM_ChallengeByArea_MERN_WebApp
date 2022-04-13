import { Outlet } from "react-router-dom"
import {createTheme, ThemeProvider, colors, Container/*, Typography, ButtonGroup, Button, TextField, Grid, Box*/ } from '@mui/material';

export default function Layout ({children}) { return (
    <main className="App"> 
        <MuiStyle>
            <Container maxWidth="md" sx={{marginY:1}}>
                
                {children}

                <Outlet /> 

            </Container>
        </MuiStyle>
    </main>
)}



function MuiStyle(props){
  const theme = createTheme({
    palette: {
      primary:{
        main: '#FFA500'
      },
      secondary:{
        main: colors.blue[400]
      }
    }
    , typography: {
      h2: {
        fontSize: 24,
        marginBottom: 1
      }
      , body2: {
          color: colors.deepPurple[500]
      }
    }


  });
  return(<ThemeProvider theme={theme}>
   {props.children}
  </ThemeProvider>);
}

