const express = require("express");
const expertRouter = express.Router();

const { errorHandler } = require('../middlewares');
const { Success, MiddlewareError, ErrorHandler } = require('../classes');
const  { ExpertModel }  = require('../models');


expertRouter.route('/:email')   //  localhost:3500/api/expert/:x
  .get(async (req, res, next) => {  //req.params/ req.query
    console.log(':: expert router get by email');
    errorHandler(req, res, next)( async () => {

      let result = await ExpertModel.find({/* */});
      return new Success(200, result);
    });  //error handler 
  });

expertRouter.route('/')
  .post( async (req, res, next) => {
      console.log(':: expert router post');
      errorHandler(req, res, next)( async () => {

      });  //error handler 
  });


module.exports = expertRouter;