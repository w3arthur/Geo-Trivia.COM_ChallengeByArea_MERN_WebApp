const {mongoose, mongoose1, schemaVersion} = require("../connection");

//module and validator  
const QuestionModel = mongoose1.model(
  "Question"  //questions
  , new mongoose.Schema({
    schemaVersion: schemaVersion
    , location: {type: mongoose.ObjectId, index: true}
    , language: { type: String, trim: true, index: true}
    , image: { type: String, trim: true, }
    , question: { type: String, trim: true, index: true}
    , answers: { type: [Object] } //answerer,  answered_counter
    , rightAnswer: { type: Number }
    , approved: { type: Boolean, default: false, index: true }
    , displayedCounter: { type: Number, default: 0 }
    , statistic: { type: Array }
  })
);

module.exports = QuestionModel;