import React from "react";

import PropTypes from 'prop-types';
import { Box, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { styled } from '@mui/material/styles';
import * as Icons from '@mui/icons-material';

export default function PopUp({open, handleClose, title, children, handleSubmit, submitText}) {
const render = () => (
  <div>
    <BootstrapDialog  PaperProps = {{sx:  {minHeight : '300px'}}} fullWidth={true}  open={open} onClose={handleClose} aria-labelledby="customized-dialog-title" >
      <PopUpTitle onClose={handleClose} sx={{direction: 'ltr'}}> {title || <br />} </PopUpTitle> 
      <DialogContent dividers><Box sx={{minHeight: '300px'}}> {children} </Box></DialogContent>
      <DialogActions> {submitText ? (<Button startIcon={<Icons.Check/>} sx={{height: '28px', mt: '8px', mb: '8px'}} autoFocus onClick={handleSubmit}> {submitText} </Button>) : (<></>)} </DialogActions>
    </BootstrapDialog>
  </div>
); 


return render();}

const PopUpTitle = (props) => {
  const { children, onClose, ...other } = props;
  return (
    <DialogTitle sx={{ m: 0, p: '12px '}} {...other}> 
      {children}
      {onClose ? ( <IconButton sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500], }} aria-label="close" onClick={onClose} > <Icons.Close /> </IconButton> ) : null}
    </DialogTitle>
  );
};

PopUpTitle.propTypes = { children: PropTypes.node, onClose: PropTypes.func.isRequired, };

const BootstrapDialog = styled(Dialog)(({ theme }) => ({ '& .MuiDialogContent-root': { padding: theme.spacing(2), }, '& .MuiDialogActions-root': { padding: theme.spacing(1), } }));