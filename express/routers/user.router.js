const express = require("express");
const userRouter = express.Router();
const Joi = require("joi");
const bcrypt = require("bcrypt");
const {mongoose, mongoose1} = require("../connection");
const error = require('../api/errorMessage.router');

userRouter.route('/') //  localhost:3000/api/users
  .post(userValidator, async (req, res, next) => { 
    try{
    //Add try/catch
      const {email} = req.body;
      let user = await UserModel.findOne({ email: email });
      if (user !== null) throw error(452, 'user already exist!');
      let userRegister = req.body;
      userRegister.password = await bcrypt.hash(userRegister.password, 10)
      let result = await new UserModel(userRegister).save();
      return res.status(200).send(result);
     } catch(err){  return next(err); }  //error handler 
  })
  .get(async (req, res, next) => { 
    try{
      let users = await UserModel.find();
      if (!users) throw error(400, 'no users');
      return res.status(200).json(users);
    } catch(err){  return next( err(req) ); }  //error handler
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
  try{
    const { error } = Joi.object({
      name: Joi.string().min(4).max(50).required()
      , email: Joi.string().email().required()
      , password: Joi.string()
      , type: Joi.string()
    }).validate(req.body);
    if (error && error.details) throw error('400', error.details[0].message.toString());//.send(error.details[0].message);
    next();
  } catch(err){ return next( err(req) ); }  //error handler
};

module.exports.UserModel = UserModel;