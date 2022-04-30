require("dotenv").config();


const requiredQuestionsQuantity = Number(process.env.QUESTIONS_QUANTITY);

const radiosPointDiameter = [
  Number(process.env.POINT_DIAMETER1)
  ,Number(process.env.POINT_DIAMETER2)
  ,Number(process.env.POINT_DIAMETER3)
  ,Number(process.env.POINT_DIAMETER4)
  ,Number(process.env.POINT_DIAMETER5)
];

const express = require("express");
const questionRouter = express.Router();

const {mongoose, mongoose1, schemaVersion} = require("../connection");
const { errorHandler } = require('../middlewares');
const { Success, MiddlewareError, ErrorHandler } = require('../classes');

const { AreaModel, QuestionModel } = require('../models');


questionRouter.route('/:language')   //  localhost:3500/api/question
.get(async (req, res, next) => {
  console.log(':: question router get');
  errorHandler(req, res, next)( async () => {
    const radiosArray = radiosPointDiameter; //in KM
    const requiredQuestions = requiredQuestionsQuantity;
    const {language} = req.params;
    const {lat, long} = req.query;
    const coordinates = [Number(lat), Number(long)];

    let i = 0;
    let areas, questions;
    while(i < radiosArray.length){  //find questions for founded areas
      while(i < radiosArray.length){  //find areas for i radios
        const query = { location:{$geoWithin : { $centerSphere: [ coordinates, radiosArray[i] ] } } };
        areas = await AreaModel.find( query, {_id: 1} );    //find areas id in near radios
        if(!areas || areas.length === 0) i++;
        else break;
        }
      const areasId = []; //create array of areas id
      areas.map( x => {areasId.push( x._id )} );
      if(!areas || areasId.length === 0) throw new ErrorHandler(400, 'no areas for this radios!');

      questions = await QuestionModel.aggregate([
        { $match : { location: { $in: areasId }, language } } //language added
        , { $sample: { size: requiredQuestions } } //random X questions
      ]);
      console.log(questions.length);
      if(!questions || questions.length < requiredQuestions) i++;
      else break;
      }
      
    if(!questions || questions.length < requiredQuestions) throw new ErrorHandler(400, 'not enoughs question found for this erea !');
    return new Success(200, questions);
  });  //error handler 
})
.post(async (req, res, next) => {
  console.log(':: question router post');
  errorHandler(req, res, next)( async () => {
    const {language} = req.params;
    //const {} = req.query;
    const {location, question, answers, rightAnswer} = req.body;

    const areaFound = await AreaModel.findOne({_Id: location});
    if(!areaFound) throw new ErrorHandler(400, 'area not found');
    
    const statistic = []; //statistic prefer.
    answers.map((x,i) => {statistic.push( {answer: i, counter: 0} ) } )

    const data = {location, question, answers, rightAnswer, language, statistic};
    let result = await new QuestionModel( data ).save();
    if(!result) new ErrorHandler(400, 'cant save this question');

    return new Success(200, result);
  });  //error handler 
});


module.exports = questionRouter;