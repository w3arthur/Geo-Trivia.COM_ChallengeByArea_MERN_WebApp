const {mongoose, mongoose1} = require("../connection");

//module and validator
const FlowerModel = mongoose1.model(
  "Flower"  //flowers
  , new mongoose.Schema({
    name: { type: String, trim: true, require: true, minlength: 4, maxlength: 50, unique: true, }
    , price: { type: Number, require: true, }
    , color: { type: String, trim: true, }
    , image: { type: String, trim: true, }
    , type: { type: String, trim: true, }
  }, { timestamps: true, })
);

module.exports =  FlowerModel;