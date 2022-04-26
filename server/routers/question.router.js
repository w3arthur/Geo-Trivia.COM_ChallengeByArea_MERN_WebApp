require("dotenv").config();
const radiosPointDiameter = process.env.POINT_DIAMETER;
const requiredQuestionsQuantity = process.env.QUESTIONS_QUANTITY;

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
    const radios = Number(radiosPointDiameter); //in KM
    const requiredQuestions = Number(requiredQuestionsQuantity);

    const {language} = req.params;
    const {lat, long} = req.query;
    const coordinates = [Number(lat), Number(long)];
    const query = { location:{$geoWithin : { $centerSphere: [ coordinates, radios ] } } };

    //find areas id in near radios
    const areas = await AreaModel.find( query, {_id: 1} );
    const areasId = []; //create array of areas id
    areas.map( x => {areasId.push( x._id )} );
    if(!areas || areasId.length === 0) throw new Error();

    const questions = await QuestionModel.aggregate([
      { $match : { location: { $in: areasId }, language } } //language added
      , { $sample: { size: requiredQuestions } } //random X questions
    ]);
    console.log(questions.length);  //to delete
    if(!questions || questions.length < requiredQuestions) throw new Error();

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
    if(!areaFound) throw new Error();

    const data = {location, question, answers, rightAnswer, language};
    let result = await new QuestionModel( data ).save();
    if(!result) new Error();

    return new Success(200, result);
  });  //error handler 
});


module.exports = questionRouter;