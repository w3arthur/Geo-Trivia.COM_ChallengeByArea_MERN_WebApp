const express = require("express");
const userRouter = express.Router();
const Joi = require("joi");
const bcrypt = require("bcrypt");
const {mongoose, mongoose1} = require("../connection");
const {errorHandler, error, success, middlewareError} = require('../api/errorHandler.middleware');

userRouter.route('/') //  localhost:3000/api/users
  .post(userValidator, async (req, res, next) => {
    errorHandler(req, res, next)( async () => {
    //Add try/catch
      const {email} = req.body;
      let user = await UserModel.findOne({ email: email });
      if (user !== null) throw error(452, 'user already exist!');
      let userRegister = req.body;
      userRegister.password = await bcrypt.hash(userRegister.password, 10)
      let result = await new UserModel(userRegister).save();
      return success(req, res)(200, result);
     });  //error handler 
  })
  .get(async (req, res, next) => { 
    console.log(':: user router get');
    errorHandler(req, res, next)( async () => {
      let users = await UserModel.find();
      if (!users) throw error(400, 'no users');
      return success(req, res)(200, users);
    });  //error handler 
  })
  ;

module.exports = userRouter;

//module and validator
const UserModel = mongoose1.model(
  "User"  //users
  , new mongoose.Schema({
    name: { require: true, type: String, trim: true,  minlength: 4, maxlength: 50, }
    , email: { unique: true, require: true, type: String, trim: true,  }
    , password: { type: String, trim: true, }
    , type: { type: String, trim: true, }
  })
);
function userValidator(req, res, next){
  console.log(':: user validator middleware');
    const { error } = Joi.object({
      name: Joi.string().min(4).max(50).required()
      , email: Joi.string().email().required()
      , password: Joi.string()
      , type: Joi.string()
    }).validate(req.body);
    if (error && error.details) return middlewareError(next)(400, 'validation user info error', error.details[0].message.toString()); //.send(error.details[0].message);
    next();
};

module.exports.UserModel = UserModel;