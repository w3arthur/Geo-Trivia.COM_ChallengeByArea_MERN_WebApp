const express = require("express");
const rateRouter = express.Router();

const {mongoose, mongoose1, schemaVersion} = require("../connection");
const { errorHandler } = require('../middlewares');
const { Success, MiddlewareError, ErrorHandler } = require('../classes');

//const { RateModel } = require('../models');

rateRouter.route('/')   //  localhost:3500/api/... ?
  .post(async (req, res, next) => {  //req.params/ req.query
    console.log(':: rate router post');
    errorHandler(req, res, next)( async () => {

    });  //error handler 
  });



module.exports = rateRouter;
