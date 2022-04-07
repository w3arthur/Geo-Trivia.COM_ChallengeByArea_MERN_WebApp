const express = require("express");
const userRouter = express.Router();
const Joi = require("joi");
const bcrypt = require("bcrypt");
const {mongoose, mongoose1} = require("../connection");

userRouter.route('/') //  localhost:3000/api/users
  .post(userValidator, async (req, res) => { 
    //Add try/catch
    const {email} = req.body;
    let user = await UserModel.findOne({ email: email });
    if (user !== null) return res.status(452).send( "user already exist!");
    //console.log('req.body',req.body);
    let userRegister = req.body;
    userRegister.password = await bcrypt.hash(userRegister.password, 10)
    let result = await new UserModel(userRegister).save();
    return res.status(200).send(result);
  })
  .get(async (req, res) => { 
    let users = await UserModel.find();
    if (!users) return res.status(400).send("no users");
    return res.status(200).json(users);
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
  const { error } = Joi.object({
    name: Joi.string().min(4).max(50).required()
    , email: Joi.string().email().required()
    , password: Joi.string()
    , type: Joi.string()
  }).validate(req.body);

  if (error && error.details) return res.status(400).send( error.details[0].message.toString() );//.send(error.details[0].message);
  next();
};


module.exports.UserModel = UserModel;