import React, {} from 'react';
import {Box, Grid, Typography, Button,  Chip, Avatar } from "@mui/material";


export default function Question(){


    return(<>
        <QuestionValue>When Tel Aviv established?</QuestionValue>

        <Grid container>
        
            <Answer number="1" onClick={() => {}}>  1990 fg fdhdf hdhfh dfh df df hdhdfhdfhdfh dhdhdfhdhh </Answer>

            <Answer number="2" onClick={() => {}}>  1850 </Answer>

            <Answer number="3" onClick={() => {}}>   1750  </Answer>

            <Answer number="4" onClick={() => {}}>  1950 </Answer>

        </Grid>

        <Grid sx={{mt:5, textAlign: 'center', width: '100%'}}>
            <Submit>Submit</Submit>
        </Grid>

        <Grid sx={{mt:5, textAlign: 'center', width: '100%'}}>
            <Helper onClick={() => {}}>50/50</Helper>
            <Helper onClick={() => {}}>Statistic</Helper>
            <Helper onClick={() => {}}>Follow</Helper>
        </Grid>
    </>);
}

function Submit(props){
    return(<>
        <Button variant="contained" size="large" sx={{minHeight: 50, fontSize: 25}}>{props.children}</Button>
    </>);
}

function Helper(props){
    return(<>
        <Button onClick={props.onClick} variant="outlined" color="primary" size="large" sx={{m: 2,minHeight: 50, fontSize: 25}}>{props.children}</Button>
    </>);
}


function QuestionValue(props){
    return(<>
        <Box style={{  minHeight:'20vh', width: '100%', display: 'flex'}}>
            <Typography variant="h4" > {props.children} </Typography>
        </Box>
    </>);
}

function Answer(props){
    return(<>
        <Grid md={6} xs={12} sx={{p: 2}} container >
        
                <Chip onClick={props.onClick} 
                    avatar={<Avatar onClick={props.onClick}><Typography component="div" className="answerNumber">{props.number}</Typography></Avatar>} 
                    label={<Typography variant="h5" component="div" className="answerValue" >{props.children}</Typography>} /> 
        </Grid>
    </>);
}