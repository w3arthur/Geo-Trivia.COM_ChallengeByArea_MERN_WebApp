const {mongoose, mongoose1, schemaVersion} = require("../connection");

//module and validator
const UserModel = mongoose1.model(
  "User"  //users
  , new mongoose.Schema({
    schemaVersion: schemaVersion
    , name: { require: true, type: String, trim: true,  minlength: 4, maxlength: 50, }
    , email: { unique: true, require: true, type: String, trim: true,  }
    , password: { type: String, trim: true, }
    , role: { type: [Number] }
    , age: { type: Number, trim: true, }
    , selectedLanguage: { type: String, trim: true, }
    , answeredQuestions: { type: Number }
    , totalScore: { type: Number }
    , selectedLocation : { type: [Number] }
  })
);

module.exports = UserModel;