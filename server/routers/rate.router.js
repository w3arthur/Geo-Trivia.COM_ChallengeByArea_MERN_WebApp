const express = require("express");
const rateRouter = express.Router();

const {mongoose, mongoose1, schemaVersion} = require("../connection");
const { errorHandler } = require('../middlewares/errorHandlerLogging.middleware');
const { Success, MiddlewareError, ErrorHandler } = require('../classes');

const { RateModel } = require('../modules');

rateRouter.route('/')   //  localhost:3500/api/question/:x
  .post(async (req, res, next) => {  //req.params/ req.query
    console.log(':: rate router post');
    errorHandler(req, res, next)( async () => {
      //const {...} = req.body;
      /*const result = await new RateModel({ ... }).save();
      //post an email!
      return new Success(200, result);*/
    });  //error handler 
  });



module.exports = rateRouter;
