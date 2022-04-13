const express = require("express");
const userRouter = express.Router();

const { errorHandler } = require('../middlewares/errorHandlerLogging.middleware');
const validatorUser = require('../middlewares/validatorUser.middlewawre');
const { Success, MiddlewareError, ErrorHandler } = require('../classes');

const { UserModel } = require('../modules');

const bcrypt = require("bcrypt");

userRouter.route('/') //  localhost:3500/api/users
  .post(async (req, res, next) => {
    console.log(':: user router post');
    errorHandler(req, res, next)( async () => {

    //Add try/catch
      const {name, email, password} = req.body;
      let user = await UserModel.findOne({ email: email });
      if (user !== null) throw new ErrorHandler(452, 'user already exist!');
      let userRegister = {name, email, password};
      userRegister.password = await bcrypt.hash(userRegister.password, 10);
      userRegister.role = 2001; //admin //to delete
      let result = await new UserModel(userRegister).save();
      
      return new Success(200, result);

     });  //error handler 
  })
  .get(async (req, res, next) => { 
    console.log(':: user router get');
    errorHandler(req, res, next)( async () => {
      let users = await UserModel.find();
      if (!users) throw new ErrorHandler(400, 'no users');
      return new Success(200, users);
    });  //error handler 
  })
  ;

module.exports = userRouter;
