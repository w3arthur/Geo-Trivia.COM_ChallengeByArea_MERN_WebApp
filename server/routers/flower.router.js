const express = require("express");
const flowerRouter = express.Router();
const { errorHandler } = require('../middlewares');
const validatorFlower = require('../middlewares/validatorFlower.middlewawre')

const { Success, ErrorHandler, MiddlewareError } = require('../classes');
const { FlowerModel } = require('../modules');

flowerRouter.route('/')   //  localhost:3000/api/flowers
  .get(async (req, res, next) => {  //req.params/ req.query
    console.log(':: flower router get');
    errorHandler(req, res, next)( async () => {
      let result = await FlowerModel.find({type: req.user.type});
      return new Success(200, result);
    });  //error handler 
  })
  .post( validatorFlower,  async (req, res, next) => { //,auth
      console.log(':: flower router post');
      errorHandler(req, res, next)( async () => {
        const {name, price, color, image, type} = req.body;
        const flower = await FlowerModel.findOne({ name: name });
        if (flower !== null)  throw new ErrorHandler(400, 'flower already exist!');
        const result = await new FlowerModel({ name, price, color, image, type }).save();
        return new Success(200, result);
      });  //error handler 
  })
  ;
module.exports = flowerRouter;




