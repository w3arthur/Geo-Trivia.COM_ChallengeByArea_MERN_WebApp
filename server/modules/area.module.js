const {mongoose, mongoose1, schemaVersion} = require("../connection");

//module and validator
const AreaModel = mongoose1.model(
  "Area"  //areas
  , new mongoose.Schema({
    schema_version: schemaVersion
    , geoLocation: { type: [Number]}
    , name: { type: String, trim: true, }
    , totalScore: { type: String, trim: true, }
  })
);

module.exports = AreaModel;