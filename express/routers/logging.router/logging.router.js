//const { nextDay } = require('date-fns');
const express = require('express');
const loggingRouter = express.Router();
const {mongoose, mongooseLogging} = require("../../connection"); 
const { errorHandler } = require('../../middlewares');
const { Success, ErrorHandler } = require('../../classes');

loggingRouter.route('/') //  localhost:3000/api/logging
    .post( async (req, res, next) => {
      errorHandler(req, res, next)( async () => {
        console.log(':: login router post');
        const {data, number} = req.body;
        if (! req.body) throw new ErrorHandler(400, 'no logging body, wrong request');
        await new LoggingModel({ data, number }).save();
        return new Success(200, 'logging sent');
      });  //error handler 
  } );


module.exports = loggingRouter;

//module and validator
const LoggingModel = mongooseLogging.model(
  "React_Logging"  //react_loggings
  , new mongoose.Schema({
    data: { type: String }
    , number: { type: Number }
  }, { timestamps: true, })
);
