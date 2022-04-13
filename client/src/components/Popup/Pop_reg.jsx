import React from "react";
import "./pop_reg.css";
import { Link } from "react-router-dom";
import { TextField } from "@mui/material";

const Pop_reg = ({ active, setActive }) => {
  return (
    <div className={active ? "pop_reg active" : "pop_reg"}>
      <div className="pop_reg_content">
        <div className="pop_reg_close" onClick={() => setActive(false)}>
          X
        </div>
        <TextField
          id="standard-basic"
          label="Email"
          variant="outlined"
          className="reg_input"
          sx={{ mb: 2 }}
        />
        <TextField
          id="standard-basic"
          label="Age"
          variant="outlined"
          className="reg_input"
          sx={{ mb: 2 }}
        />
        <TextField
          id="standard-basic"
          label="Password"
          variant="outlined"
          className="reg_input"
          sx={{ mb: 2 }}
        />
        <TextField
          id="standard-basic"
          label="Confirm password"
          variant="outlined"
          className="reg_input"
          sx={{ mb: 2 }}
        />

        <Link className="button" to="/">
          Registration
        </Link>
      </div>
    </div>
  );
};

export default Pop_reg;
