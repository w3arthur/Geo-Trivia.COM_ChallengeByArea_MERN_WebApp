const express = require("express");
const flowerRouter = express.Router();
const Joi = require("joi");
const mongoose = require("../connection");

flowerRouter.route('/')   //  localhost:3000/api/flowers
  .get(async (req, res) => {  //req.params/ req.query
    let result = await FlowerModel.find({type: req.user.type});
    res.status(200).send(result);
  })
  .post( flowerValidator,  async (req, res) => { //,auth
      const {name, price, color, image, type} = req.body;
      const flower = await FlowerModel.findOne({ name: name });
      if (flower !== null)  return res.status(400).send("flower already exist!");
      const result = await new FlowerModel({ name, price, color, image, type }).save();
      return res.status(200).send(result);
  })
  ;
module.exports = flowerRouter;

//module and validator
const FlowerModel = mongoose.model(
  "Flower"  //flowers
  , new mongoose.Schema({
    name: { type: String, trim: true, require: true, minlength: 4, maxlength: 50, unique: true, }
    , price: { type: Number, require: true, }
    , color: { type: String, trim: true, }
    , image: { type: String, trim: true, }
    , type: { type: String, trim: true, }
  }, { timestamps: true, })
);

function flowerValidator (req, res, next) {
  const { error } =  Joi.object({
      name: Joi.string().min(4).max(50).required()
      , price: Joi.number().min(1).required()
      , color: Joi.string()
      , image: Joi.string()
      , type: Joi.string()
    }).validate(req.body);
  //error message for middleWhere
  if (error && error.details)  return res.status(400).send(error.details[0].message.toString());//.json(error.details[0].message);  //Error Message
  next();
};




