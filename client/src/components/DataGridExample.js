import React from 'react';
import { Typography, Button, TextField, Grid, Box } from '@mui/material';
import * as Icon  from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';

//import {MuiSty
const columns = [
  { field: "id", headerName: "ID", width: 20, description:"Product id" }
  , { field: "image", headerName: "Image", width: 100, sortable: false, description:"Product image"
    , renderCell: (rowCell) => (
      <div onClick={(e) => {}}> <img alt={'image '+rowCell.id} style={{width: '60px', height:'auto'}} src={rowCell.value} /> </div> ) 
    }
  , { field: "title", headerName: "Product Name", flex: 1, align: "left", description:"Item name"
    , renderCell: (rowCell) => (
        <div onClick={(p, e) => {}}  style={{ color: "blue", fontSize: 18, width: "100%", textAlign: "left" }}> {rowCell.value} </div>) 
    //, valueGetter: (params) => { return `${params.getValue(params.id, "image") || ""} ${ params.getValue(params.id, "title") || "" }`;}/
    }
  , { field: "price", headerName: "Price", type: "number", width: 90, align: "center" }
];

export default function DataGridExample() {
    const [data, setData] = React.useState();

    const { t } = useTranslation();  //MultyLanguage

    const loadData = async() => {
        console.log('Start Load Fetch');
        const url="https://fakestoreapi.com/products";
        let result, jsonResult;
        try{
          result = await fetch(url);
          if(await result?.ok || await result?.status === 200) jsonResult =  await result?.json();
          else {  }
        } catch(ex){  }
        setData( await jsonResult );
    };

    React.useEffect(() => { loadData(); },[]
  );
  return (<>
      <Grid container spacing={2}>
        <Grid item md={2} sx={{ display: { xs: 'none', md: 'block' }}}>
                {t('Left Grid')}   <br/>
                {t('hide')} <br/>
        </Grid>
        <Grid item xs={12} md={8}> <Box sx={{ alignItems: 'center'}}>
            <Box sx={{ display: 'flex', }}>
            <Button href="#"  endIcon={<Icon.AcUnit />} variant="contained" color="primary" sx={{maxHeight: 30,fontSize: 9, marginTop:1}}  size="md" >
                    {t('Button')}
            </Button>
            <TextField  focused  label="Input"  size="small" sx={{ marginLeft: 5}} fullWidth   />
            </Box>
            <br />
            <Typography marginBottom={1} variant="h2" component="h2">{t('Typography Text')}</Typography>
            <div style={{ height: 400, width: "100%"/*, minWidth: 600*/ }}>
            <DataGrid rows={ data } columns={columns}
            pagination rowsPerPageOptions={[5, 10, 20]}  //!!
            checkboxSelection //disableSelectionOnClick !!
            />
            </div>

        </Box> </Grid>
        <Grid item  md={2}>
            {t('Right Grid')}
        </Grid>
    </Grid>            
  </>);
}




