const express = require('express');
const { exceptions } = require('winston');
const loggingRouter = express.Router();
const {mongoose, mongooseLogging} = require("../connection"); 

loggingRouter.route('/') //  localhost:3000/api/logging
    .post( async (req, res) => { 
      const {data, number} = req.body;
      if (! req.body)  return res.status(400).send("no logging, wrong request");
      await new LoggingModel({ data, number }).save();
      return res.status(200).send('ok');
  } );
module.exports = loggingRouter;

//module and validator
const LoggingModel = mongooseLogging.model(
  "Logging"  //loggings
  , new mongoose.Schema({
    data: { type: String }
    , number: { type: Number }
  }, { timestamps: true, })
);