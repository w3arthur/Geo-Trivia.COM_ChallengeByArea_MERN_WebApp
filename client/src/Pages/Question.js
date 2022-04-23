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

function Submit({key, children ,...props}){
    return(
        <Button key={key} {...props} variant="contained" sx={{minHeight: 50, fontSize: 25}}>{children}</Button>
        );
}

function Helper({key, onClick, children, ...props}){
    return(
        <Button {...props} onClick={onClick} variant="outlined" sx={{m: 2, minHeight: 50, fontSize: 25}}>{children}</Button>
        );
}


function QuestionValue({ children, ...props}){
    return(
        <Box style={{  minHeight:'20vh', width: '100%', display: 'flex'}}>
            <Typography {...props} variant="h4" > {children} </Typography>
        </Box>
        );
}

function Answer({ md, xs ,onClick, children, number ,...props}){
    return(
        <Grid item container md={6} xs={12} sx={{p: 2}}  >
                <Chip {...props} sx={{}} className="answer" onClick={onClick} 
                    avatar={<Avatar sx={{ bottom: "50%", left: "top" }}><Typography component="div" className="answerNumber">{number}</Typography></Avatar>} 
                    label={<Typography variant="h5" component="div" className="answerValue" >{children}</Typography>} /> 
        </Grid>
        );
}