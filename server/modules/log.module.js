const {mongoose, mongooseLogging} = require("../connection"); 


//module and validator
const LoggingModel = mongooseLogging.model(
  "React_Logging"  //react_loggings
  , new mongoose.Schema({
    user: { type: Object }
    , data: { type: Object }
    , response: { type: Object }
    , details:  { type: Object }
    , toDelete: { type: Boolean, default: false}
  }, { timestamps: true, })
);

const ErrorModel = mongooseLogging.model(
  "React_Error"  //react_errors
  , new mongoose.Schema({
    user: { type: Object }
    , data: { type: Object }
    , response: { type: Object }
    , details:  { type: Object }
    , toDelete: { type: Boolean, default: false}
  }, { timestamps: true, })
);

module.exports = {LoggingModel, ErrorModel};