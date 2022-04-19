import React from "react";
import { Grid, Card, Chip , Paper, Link, Box, Button, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import monkeyLeft from './images/monkeyLeft.png';
import monkeyRight from './images/monkeyRight.png';

export default function Location() {
  const { t } = useTranslation();
  return (
    <Grid container>

      <Typography variant="h1" sx={{ fontWeight: "bold" }}> {t("Location")} </Typography>

      <Selection onClick={() => {}} leftMonkey>Selection 1</Selection>

      <Selection onClick={() => {}} rightMonkey>Selection 2</Selection>

      <Selection onClick={() => {}} leftBottomMonkey>Selection 3</Selection>

    </Grid>
  );
}

function Selection(props){
  const {leftMonkey, leftBottomMonkey, rightMonkey} = props;
  const additionStyle = leftMonkey? ({marginLeft: 'auto', marginTop: '30vh'}) 
    : rightMonkey? ({marginRight: 'auto', marginTop: '25vh'})
    : leftBottomMonkey? ({marginLeft: 'auto', marginTop: '20vh'})
    : null;
  const styleImage = {display: 'block', width: '75%', maxHeight: '75%', maxWidth: '75%', ...additionStyle};

  return(<>
      <Grid sm={4} sx={{p:2, display: { xs: 'none', sm: 'block' }}}>
          <SelectionValue>{props.children}</SelectionValue>
      </Grid>

      {leftMonkey || leftBottomMonkey  ? 
      <SelectionImageGrid onClick={props.onClick}>
        <img alt="monkeyLeft" src={monkeyLeft} style={styleImage}/>
      </SelectionImageGrid> : null}

      <Grid xs={8} sx={{p:1 ,height: '100%' ,display: { xs: 'block', sm: 'none' }}}>
        <SelectionValue onClick={props.onClick}>{props.children}</SelectionValue>
      </Grid>

      {rightMonkey ? (
        <SelectionImageGrid onClick={props.onClick}>
            <img alt="monkeyRight" src={monkeyRight} style={styleImage} />
        </SelectionImageGrid>
      ) : (<></>)}
      
  </>);
}

function SelectionImageGrid(props){
  return(<>
    <Grid onClick={props.onClick} xs={4} sx={{height: '100%',display: { xs: 'block', sm: 'none' }}}>
      {props.children}
    </Grid>
  </>);
}

function SelectionValue(props){
  return(<>

      <Paper  onClick={ props.onClick } sx={{height: '50vh'}} elevation={3}>

        <Typography variant="h4">{props.children}</Typography>
            
      </Paper>
  
  </>);
}

