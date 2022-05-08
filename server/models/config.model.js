const {mongoose, mongoose1, schemaVersion} = require("../connection");

const ConfigSchema = new mongoose.Schema({
  schema_version: schemaVersion
  , server: { type: Object }
  , client: { type: Object }
}, { timestamps: true });

//module and validator
const ConfigModel = mongoose1.model(
  "Config"  //configs
  , ConfigSchema
);

module.exports = ConfigModel;