//module and validator
const {mongoose, mongooseLogging} = require("../connection"); 

const NodeJSLoggingModel = mongooseLogging.model( 
    "NodeJs_Logging"  //nodejs_loggings
    , basedLoggingSchema({ resultStatus: { type: Number, index: true }, resultMessage: { type: String, index: true } , resultJson: { type: Object, index: true } }) 
);

const NodeJSErrorModel = mongooseLogging.model( 
    "NodeJs_Error" //nodejs_errors
    , basedLoggingSchema({ status: { type: Number, index: true }, errorName: { type: String, index: true } , errorMessage: { type: String, index: true } })
);

module.exports = {NodeJSLoggingModel, NodeJSErrorModel};

function basedLoggingSchema (additionalObjects){
    return new mongoose.Schema({
    ...additionalObjects
    , title: { type: String, index: true }
    , localTime: { type: Date, default: Date.now, index: true }
    , method: { type: String, index: true }
    , user: {type: Object, index: true}
    , url: { type: String, index: true}
    , body: { type: Object, index: true }
    , headers: { type: Object, index: true }
    , toDelete: { type: Boolean, default: false, index: true}
    , params: {type: Object, index: true}
  }, { timestamps: true, })
}


