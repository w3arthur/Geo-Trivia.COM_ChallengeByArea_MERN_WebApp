import { makeStyles } from '@mui/material';


export const useStyles = makeStyles((theme) => ({

    main: {
        maxWidth: "1200px",
        mx: "auto",
        py: "75px",
      },      
      button: {
        // display: inline-block,
          fontSize: "25px",
          bgColor: "#FFA800",
          color: "#FFFFFF",
          py: "10px",
          px: "50px",
          borderRadius: "15px",
          my: theme.spacing(3),
          textDecoration: "none",
      },
      header: {
        bgImage: `url('./Image/Header.jpeg')`,
        height: '60vh',        
        bgSize: "cover",
        bgRepeat: "no-repeat",        
        bgPosition: "center",    
    }
   
}));

