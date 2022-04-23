const express = require("express");
const areaRouter = express.Router();

const { errorHandler } = require('../middlewares/errorHandlerLogging.middleware');
const { Success, MiddlewareError, ErrorHandler } = require('../classes');
const  { AreaModel }  = require('../models');


areaRouter.route('/')   //  localhost:3500/api/area/
  .get(async (req, res, next) => {  // only for reference!
    console.log(':: area router get by area_name');
    errorHandler(req, res, next)( async () => {
      let result = await AreaModel.find();
      return new Success(200, result);
    });  //error handler 
    })
  .post(async (req, res, next) => {
    console.log(':: area router post');
    errorHandler(req, res, next)( async () => {
      const {coordinates, country,  area} = req.body;
      
      const location = { coordinates };

      data = {location, country, area };
      
      const result = await AreaModel( data ).save()
      if(!result) throw new Error();  //to fix

      return new Success(200, result);
    });  //error handler 
  });


module.exports = areaRouter;

