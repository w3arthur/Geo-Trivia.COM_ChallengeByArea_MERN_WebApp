import express from "express";
import mongoose from "mongoose";
import cors from "cors";
var app = express();
import Fruits from "./models/fruit.js";

app.use(cors());

const PORT = process.env.PORT || 3005;

mongoose
  .connect(
    "mongodb+srv://Polina:polina@cluster0.i7jlb.mongodb.net/Greengrocer?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("connect to db");
  })
  .catch((err) => {
    console.log("could not connect to mongo", err);
  });

app.listen(PORT, () => {
  console.log(`server is working on ${PORT}`);
});
