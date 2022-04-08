//const { nextDay } = require('date-fns');
const express = require('express');
const loggingRouter = express.Router();
const {mongoose, mongooseLogging} = require("../../connection"); 
const {errorHandler, error, success} = require('../../api/errorHandler.middleware');
const { Success, ErrorHandler } = require('../../classes');

loggingRouter.route('/') //  localhost:3000/api/logging
    .post( async (req, res, next) => {
      errorHandler(req, res, next)( async () => {
        console.log(':: login router post');
        const {data, number} = req.body;
        if (! req.body) throw error( new ErrorHandler(400, 'no logging body, wrong request') );
        await new LoggingModel({ data, number }).save();
        return success(req, res)( new Success(200, 'logging sent') );
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
