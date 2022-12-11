
const { mongoose, mongooseMenora, schemaVersion } = require("../../connection");

const UserSchema = new mongoose.Schema({
  schemaVersion: schemaVersion
  , name: { type: String, trim: true, index: true, required: true }
  , password: { type: String, trim: true, required: true }
  , role: { type: [Number], default: [1000], index: true }
  , favorites: { type: [Object], default: [], index: true }
}, { timestamps: true, })

//UserSchema.index({});

const UserModel = mongooseMenora.model(
  "User"  //users
  , UserSchema
);

module.exports = UserModel;
