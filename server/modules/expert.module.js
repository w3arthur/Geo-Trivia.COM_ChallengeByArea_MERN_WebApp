const {mongoose, mongoose1, schemaVersion} = require("../connection");

//module and validator
const ExpertModel = mongoose1.model(
  "Expert"  //experts
  , new mongoose.Schema({
   // schemaVersion: schemaVersion
     user: { type: mongoose.ObjectId}
    , name: { type: String, trim: true, }
    , totalScore: { type: String, trim: true, }
    , locations: { type: [Array]}
  })
);

module.exports = ExpertModel;