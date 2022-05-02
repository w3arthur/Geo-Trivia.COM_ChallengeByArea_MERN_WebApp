import React from "react";
import { Container, Typography, Box, Paperm, Button } from "@mui/material";
import * as Icons from '@mui/icons-material';
import { useTranslation } from "../Hooks";
import { Link } from "../Components";
export default function HomePage() {
  const { t } = useTranslation();

  return (<>
    <Container component="main" maxWidth="lg">
      <Typography variant="h1" sx={{ fontWeight: "bold" }}>
        {t("Trivia")}
      </Typography>
      <div className="central_text">
        <Typography
          variant="h6"
          sx={{ maxWidth: "800px", my: "15px", mx: "auto" }}
          paragraph
        >
          {t("About Game")}
        </Typography>
      </div>
      <bh />
      <Button startIcon={<Icons.Create />} component={Link} to="/Login" className="button" variant="contained" >  {t("Start to Play")} </Button>
    </Container>
  </>);
}
