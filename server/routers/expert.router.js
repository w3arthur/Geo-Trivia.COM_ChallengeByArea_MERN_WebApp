const express = require("express");
const expertRouter = express.Router();

const { errorHandler } = require('../middlewares/errorHandlerLogging.middleware');
const { Success, MiddlewareError, ErrorHandler } = require('../classes');
const  { ExpertModel }  = require('../models');


expertRouter.route('/:email')   //  localhost:3500/api/expert/:x
  .get(async (req, res, next) => {  //req.params/ req.query
    console.log(':: expert router get by email');
    errorHandler(req, res, next)( async () => {
      //const {...} = req.body;
      //let user = await UserModel.find({/* */});
      //const {id} = user; // got ObjectId
      let result = await ExpertModel.find({/* */});
      return new Success(200, result);
    });  //error handler 
  });

expertRouter.route('/')
  .post( async (req, res, next) => {
      console.log(':: expert router post');
      errorHandler(req, res, next)( async () => {
        //const {...} = req.body;
       /* const expert = await AreaModel.findOne({ ... }); //not required
        if (expert !== null)  //throw new ErrorHandler(400, 'area already exist!');
        const result = await new ExpertModel({ ... }).save();
        return new Success(200, result);*/
      });  //error handler 
  });


module.exports = expertRouter;