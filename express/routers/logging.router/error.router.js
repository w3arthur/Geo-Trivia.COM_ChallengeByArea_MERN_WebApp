//const { nextDay } = require('date-fns');
const express = require('express');
const errorRouter = express.Router();
const {mongoose, mongooseLogging} = require("../../connection"); 
const {errorHandler, error, success} = require('../../api/errorHandler.middleware');
const { Success, ErrorHandler } = require('../../classes');

errorRouter.route('/') //  localhost:3000/api/logging
    .post( async (req, res, next) => {
      errorHandler(req, res, next)( async () => {
        const {data, number} = req.body;
          if (! req.body) throw error(  new ErrorHandler(400, 'no error logging body, wrong request') );
          // throw error(400, 'no logging, wrong request');
          await new ErrorModel({ data, number }).save();
          return success(req, res)( new Success(200, 'error sent') );
      });  //error handler 
  } );


module.exports = errorRouter;

const ErrorModel = mongooseLogging.model(
  "React_Error"  //react_errors
  , new mongoose.Schema({
    data: { type: String }
    , number: { type: Number }
  }, { timestamps: true, })
);