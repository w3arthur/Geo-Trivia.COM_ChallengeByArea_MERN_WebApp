import React from "react";
import { Container, Typography, Button } from "@mui/material";
import * as Icons from '@mui/icons-material';
import { useTranslation } from "../Hooks";
import { Link } from "../Components";
export default function HomePage() {
   const { t } = useTranslation();
const render = () => (<>
  <Container component="main" maxWidth="lg">
    <Typography variant="h1"> {t("Trivia Challenging Application")} </Typography>
    <Typography paragraph variant="h6"  sx={{ maxWidth: "800px", my: "15px", mx: "auto" }}>
      {t('Welcome to Geo Trivia Game')}
    </Typography>
    
    <Button startIcon={<Icons.Create />} component={Link} to="/Login" className="button" variant="contained" >  {t("Start to Play")} </Button>
  </Container>
</>);
return render();}
