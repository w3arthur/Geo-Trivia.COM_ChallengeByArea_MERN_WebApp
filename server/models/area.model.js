const {mongoose, mongoose1, schemaVersion} = require("../connection");

const AreaSchema = new mongoose.Schema({
  schema_version: schemaVersion
  , location: {
      type: { type: String , enum: ['Point'] , default: 'Point' }
      , coordinates: { type: [Number], required: true }
    }
  , country: { type: String, trim: true, required: true, index: true }
  , area: { type: String, trim: true, required: true, index: true }
  , totalScore: { type: Number, default: 0, index: true }
  , waitingToExpertApproveQuestions: { type: [mongoose.ObjectId], default: 0, index: true }
  , experts: { type: [mongoose.ObjectId], default: [], index: true }
}, { timestamps: true, });
AreaSchema.index({location: '2dsphere'});

//module and validator
const AreaModel = mongoose1.model(
  "Area"  //areas
  , AreaSchema
);

module.exports = AreaModel;

