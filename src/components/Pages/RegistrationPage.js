import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Paper, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';


export default function Registration() {

    const { t } = useTranslation()
    return (
    <Box className="main">
        <Paper >
            <Typography variant="h4" sx={{fontWeight: 'bold'}}>
                    {t('Login with')}  
            </Typography>
            
            <Link className='button' to="/">Home</Link>
        </Paper>
    </Box>
        
    );
}

