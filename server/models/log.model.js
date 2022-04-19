const {mongoose, mongooseLogging} = require("../connection"); 


//module and validator
const LoggingModel = mongooseLogging.model(
  "React_Logging"  //react_loggings
  , new mongoose.Schema({
    user: { type: Object, index: true }
    , data: { type: Object, index: true}
    , response: { type: Object, index: true }
    , details:  { type: Object, index: true }
    , toDelete: { type: Boolean, default: false, index: true}
  }, { timestamps: true, })
);

const ErrorModel = mongooseLogging.model(
  "React_Error"  //react_errors
  , new mongoose.Schema({
    user: { type: Object, index: true }
    , data: { type: Object, index: true }
    , response: { type: Object, index: true }
    , details:  { type: Object, index: true }
    , toDelete: { type: Boolean, default: false, index: true}
  }, { timestamps: true, })
);

module.exports = {LoggingModel, ErrorModel};