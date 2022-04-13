
const {mongoose, mongoose1, schemaVersion} = require("../connection");

//module and validator
const InvitationModel = mongoose1.model(
  "Invitation"  //invitations
  , new mongoose.Schema({
    schema_version: schemaVersion
    , geoLocation: { type: [Number]}
    , email: { type: String, trim: true }
    , token: { type: String, trim: true }
  })
);

module.exports = InvitationModel;