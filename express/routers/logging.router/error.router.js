const { nextDay } = require('date-fns');
const express = require('express');
const errorRouter = express.Router();
const {mongoose, mongooseLogging} = require("../../connection"); 
const error = require('../../api/errorMessage.router');


errorRouter.route('/') //  localhost:3000/api/logging
    .post( async (req, res, next) => {
      const {data, number} = req.body;

      try{
        if (! req.body) throw error(400, 'no error logging body, wrong request');
        // throw error(400, 'no logging, wrong request');
        await new ErrorModel({ data, number }).save();
        return res.status(200).send('error sent');
      } catch(err){  return next( err(req) ); }  //error handler
  } );


module.exports = errorRouter;

const ErrorModel = mongooseLogging.model(
  "React_Error"  //react_errors
  , new mongoose.Schema({
    data: { type: String }
    , number: { type: Number }
  }, { timestamps: true, })
);