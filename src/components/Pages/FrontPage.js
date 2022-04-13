import React from "react";
import { Typography, Box, Paper } from '@mui/material'; 
import '../../App.css';
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';


export function FrontPage() { 

    const { t } = useTranslation();
    
    return (
  
    <Box className="main">
        <Paper >
            <Typography variant="h4" sx={{fontWeight: 'bold'}}>
                    {t('Trivia')}  
            </Typography>
            <Typography variant="h6" sx={{maxWidth: '800px', ml: '200px', mt: '15px' }} paragraph>                            
                    {t('About Game')}
            </Typography> 
                        <bh />                     
            <Link className="button" to="/Registration">{t('Start to Play')}</Link>
        </Paper>
    </Box>              
       
    )
}
