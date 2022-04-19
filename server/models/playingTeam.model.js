const {mongoose, mongoose1, schemaVersion} = require("../connection");

const PlayingTeamSchema = new mongoose.Schema({
  schema_version: schemaVersion
  , organizer: { type: Object, required: true, index: true}
  , players: { type: [Object], index: true }
  // _id: ObjectID, age: Int, email: String, image: String
  // accepted: true/false
  // answers = [Int]
  //helpers = { follow:{patch} false, followQuestion: undefined, _50_50: false, statistic: false };
  // score: Int
  , location: {
    type: { type: String , enum: ['Point'] , default: 'Point' }
    , coordinates: { type: [Number] ,required: true }
  } //Copy From User!
  , language: { type: String, index: true }
  , questions: { type: [Object], required: true, index: true }
  // _id: ObjectID, question: String, answers: [String], rightAnswer: Int
  , currentQuestion: {type: Number, default: 0}   //! count
  , playerCount: {type: Number, default: 1}
  , playerAcceptedCount: {type: Number, default: 1}   //! count

  //, playerAcceptedCount: { type: [Object], default: false, index: true }
  , allPlayersDone: { type: Boolean, default: false, index: true }
  , gameDone: {type: Boolean, default: false, index: true}
  , totalScores: { type: [Number], default: 0, index: true }   //! count
  , answersModel: { type: Object, require: true }
});
PlayingTeamSchema.index({location: '2dsphere'});

const PlayingTeamModel = mongoose1.model(
  "Playing_Team"  //playing_teams
  , PlayingTeamSchema
);

module.exports = PlayingTeamModel;