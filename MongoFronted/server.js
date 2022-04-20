const express=require("express");
const app=express();
const cors=require("cors");
const mongoose=require("mongoose");
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb+srv://salim:salim@cluster0.idfuq.mongodb.net/notesdb")
app.use("/note",require("./route/noteRoute"))
app.listen(3001,function(){
  console.log("express server from 3001");
})