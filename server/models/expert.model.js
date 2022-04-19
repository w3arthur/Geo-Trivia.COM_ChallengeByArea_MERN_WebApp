const {mongoose, mongoose1, schemaVersion} = require("../connection");

//module and validator
const ExpertModel = mongoose1.model(
  "Expert"  //experts
  , new mongoose.Schema({
   // schemaVersion: schemaVersion
     user: { type: mongoose.ObjectId, index: true}
    , name: { type: String, trim: true, index: true }
    , totalScore: { type: String, trim: true, index: true }
    , locations: { type: [Array], index: '2dsphere'}
  })
);

module.exports = ExpertModel;