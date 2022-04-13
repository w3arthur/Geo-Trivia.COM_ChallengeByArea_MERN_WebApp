const {mongoose, mongoose1, schemaVersion} = require("../connection");

//module and validator
const GameTeamModel = mongoose1.model(
  "Game_Team"  //game_teams
  , new mongoose.Schema({
    schema_version: schemaVersion
    , organizer: { type: mongoose.ObjectId}
    , players: { type: [mongoose.ObjectId] }
    , location: { type: [Number] }
    , language: { type: String }
    , scores: { type: [Number] }
  })
);

module.exports = GameTeamModel;