const {mongoose, mongoose1, schemaVersion} = require("../connection");

const ExpertQualifySchema = new mongoose.Schema({
  schema_version: schemaVersion
  , player: { type: Object, required: true, index: true}
  // _id: ObjectID, age: Int, email: String, image: String
  , areaId: { type: mongoose.ObjectId, required: true  }
  , location: {
    type: { type: String , enum: ['Point'] , default: 'Point' }
    , coordinates: { type: [Number] ,required: true }
  } //Copy From User!
  , language: { type: String, required: true, index: true } //from cookie
  , questions: { type: [Object], required: true, index: true }
  , answers: { type: [Number], index: true }
  // _id: ObjectID, question: String, answers: [String], rightAnswer: Int
  , gameDone: {type: Boolean, default: false, index: true}
  , scores: { type: Number, default: 0, index: true }
}, { timestamps: true, });
ExpertQualifySchema.index({location: '2dsphere'});

const ExpertQualifyModel = mongoose1.model(
  "Playing_Expert"  //playing_teams
  , ExpertQualifySchema
);

module.exports = ExpertQualifyModel;