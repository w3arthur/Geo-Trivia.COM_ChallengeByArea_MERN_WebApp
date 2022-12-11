
const {mongoose, mongoose1, schemaVersion} = require("../connection");

const TokenSchema =  new mongoose.Schema({
  schemaVersion: schemaVersion
  , name: { type: String, trim: true, index: true, required: true }
  , accessToken: { type: String, trim: true, index: true }
  , refreshToken: { type: String, index: true, trim: true, required: true}
}, { timestamps: true, })

//UserSchema.index({});

const TokenModel = mongoose1.model(
  "Token"  //tokens
  , TokenSchema
);

module.exports = TokenModel;
