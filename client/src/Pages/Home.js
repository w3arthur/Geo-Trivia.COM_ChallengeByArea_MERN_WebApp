import React from "react";
import { Container, Typography, Box, Paperm, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

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
      <Button component={Link} to="/Registration" className="button" variant="contained" >  {t("Start to Play")} </Button>
    </Container>
  </>);
}
