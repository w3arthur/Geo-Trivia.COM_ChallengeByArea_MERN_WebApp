const { mongoose, mongooseMenora, schemaVersion } = require("../../connection");

const QuestionSchema = new mongoose.Schema({
  schemaVersion: schemaVersion
  , location: { type: mongoose.ObjectId, index: true }
  , language: { type: String, trim: true, index: true }
  , image: { type: String, trim: true, }
  , question: { type: String, trim: true, index: true }
  , answers: { type: [Object] } //answerer,  answered_counter
  , rightAnswer: { type: Number }
  , approved: { type: Boolean, default: false, index: true }
  , displayedCounter: { type: Number, default: 0 }
  , statistic: { type: Array }
  , sender: { type: mongoose.ObjectId, index: true }
}, { timestamps: true, });

//module and validator
const QuestionModel = mongooseMenora.model(
  "Question"  //questions
  , QuestionSchema
);

module.exports = QuestionModel;