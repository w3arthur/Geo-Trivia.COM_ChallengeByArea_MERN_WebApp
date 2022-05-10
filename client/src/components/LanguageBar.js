import React, { useEffect, useState } from 'react';
import { Tooltip , Box, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';

import { useTranslation } from "react-i18next";
import cookies from 'js-cookie';
import i18next from 'i18next';
import classNames from 'classnames';

import { translation, sizes } from '../Config'


export default function LanguageFlags({sx}) {
  const languages = translation.languages;  //languages: [ { code: 'english', country_code: 'us', name: 'English' } , { code: 'hebrew', country_code: 'il', name: 'עברית', dir: 'rtl' }  ...
  const { t } = useTranslation();
  const currentLanguageCode = cookies.get( translation.translationCookieName /*'i18next'*/ ) || translation.defaultLanguage; //'english'
  const currentLanguage = languages.find(l => l.code === currentLanguageCode)
  
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (e) => {setAnchorEl(e.currentTarget);};
  const handleClose = () => {setAnchorEl(null);};

  useEffect(() => {
    document.body.dir = currentLanguage.dir || 'ltr'     
  },[currentLanguage])
return (
<Box sx={{ ...sx }} >
<Tooltip title={t('language')} arrow>
  <IconButton color="inherit" onClick={handleClick} size={sizes.languageTranslationIcon.buttonSize} sx={{ ml: 2 }}> <LanguageIcon style={{width: sizes.languageTranslationIcon.iconSize, height: sizes.languageTranslationIcon.iconSize}}/> </IconButton>
</Tooltip>
<Menu  anchorEl={anchorEl} open={open} onClose={handleClose} onClick={handleClose}
  transformOrigin={{ horizontal: 'right', vertical: 'top' }} anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
  disableScrollLock={true}
  PaperProps={{ elevation: 0,
    sx: { overflow: 'visible', filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
      mt: 1.5, bgcolor: '#F8F8F8', '& .MuiAvatar-root': { width: 32, height: 32, ml: -0.5, mr: 1, },
      '&:before': { bgcolor: '#F8F8F8', position: 'absolute', top: 0, right: 14, content: '""',  zIndex: 0, display: 'block', width: 10, height: 10,  transform: 'translateY(-50%) rotate(45deg)' } }
    } }>
  {languages.map(({ code, name, country_code}) => ( //set code as useContext and not as cookie!
    <Tooltip title={name} arrow placement='left'>
      <MenuItem key={country_code} style={{ backgroundColor: currentLanguageCode === code ? '#D8D8D8' : '#F8F8F8',      
                                    border: currentLanguageCode === code ? '1px solid #989898' : '#F8F8F8'  }}>
      <IconButton className={classNames('dropdown-item')} onClick={() => { i18next.changeLanguage(code); }}>
        <Box style={{height:10, fontSize:'small' }} >
          <Typography><img width="20" src={`https://flagcdn.com/w20/${country_code}.png`} srcSet={`https://flagcdn.com/w40/${country_code}.png 2x`} alt="" />{" "}{name}</Typography>
        </Box>
      </IconButton>  
      </MenuItem>    
    </Tooltip>                                   
  ))}
  
</Menu></Box>
)}