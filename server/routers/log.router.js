//const { nextDay } = require('date-fns');
const express = require('express');
const logRouter = express.Router();
const { errorHandler } = require('../middlewares');
const { Success, ErrorHandler } = require('../classes');

const { LoggingModel, ErrorModel } = require('../models');

logRouter.route('/logging') //  localhost:3500/log/logging
  .post( async (req, res, next) => {
    errorHandler(req, res, next)( async () => {
      console.log(':: login router post');
      const {user, data, response, details} = req.body;
      if (! req.body) throw new ErrorHandler(400, 'no logging body, wrong request');
      await new LoggingModel({user, data, response, details}).save();
      return new Success(200, 'logging sent');
    });  //error handler 
} );

logRouter.route('/error') //  localhost:3000/log/error
  .post( async (req, res, next) => {
    errorHandler(req, res, next)( async () => {
      const {user, data, response, details} = req.body;
        if (! req.body) throw new ErrorHandler(400, 'no error body, wrong request');
        await new ErrorModel({user, data, response, details}).save();
        return new Success(200, 'error sent');
    });  //error handler 
} );

module.exports = logRouter;