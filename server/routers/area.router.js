const express = require("express");
const areaRouter = express.Router();

const { errorHandler } = require('../middlewares/errorHandlerLogging.middleware');
const { Success, MiddlewareError, ErrorHandler } = require('../classes');
const  { AreaModel }  = require('../modules');


areaRouter.route('/:area_name')   //  localhost:3500/api/area/:x
  .get(async (req, res, next) => {  //req.params/ req.query
    console.log(':: area router get by area_name');
    errorHandler(req, res, next)( async () => {
      //const {...} = req.body;
      let result = await AreaModel.find({/* */});
      return new Success(200, result);

    });  //error handler 
  });

  areaRouter.route('/:area_name')   //  localhost:3500/api/area/:x
  .get(async (req, res, next) => {  //req.params/ req.query
    console.log(':: area router get by area_name');
    errorHandler(req, res, next)( async () => {
      //const {...} = req.body;
      let result = await AreaModel.find({/* */});
      return new Success(200, result);

    });  //error handler 
  });


  areaRouter.route('/:longitude/:latitude')   //  localhost:3500/api/area/:x/:y
  .get(async (req, res, next) => {  //req.params/ req.query
    console.log(':: area router get by longitude, latitude');
    errorHandler(req, res, next)( async () => {
      //const {...} = req.body;
     /* let result = await AreaModel.find({ ... });
      return new Success(200, result);*/

    });  //error handler 
  });

  /*
  areaRouter.route('/')
  .post( async (req, res, next) => { //,auth
      console.log(':: area router post');
      errorHandler(req, res, next)( async () => {

        //const {...} = req.body;
        const area = await AreaModel.findOne({ name: name }); //not required
        if (area !== null)  throw new ErrorHandler(400, 'area already exist!');
        const result = await new AreaModel({ ... }).save();
        return new Success(200, result);
      });  //error handler 
  });
*/



module.exports = areaRouter;

