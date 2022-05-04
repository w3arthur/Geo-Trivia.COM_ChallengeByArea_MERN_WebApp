const languageCookieName = 'i18next';

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


questionRouter.route('/:page')  //to delete  //  localhost:3500/api/question/:page
.get(async (req, res, next) => {
  console.log(':: question router get');
  errorHandler(req, res, next)( async () => {
    const questions = await QuestionModel.find({approved: true}).sort({_id:-1});
    const result = {questions: questions}
    return new Success(200, result);
  });  //error handler 
});

questionRouter.route('/') 
.post(async (req, res, next) => {
  console.log(':: question router post');
  errorHandler(req, res, next)( async () => {

    const language = ( req.cookies && req.cookies[languageCookieName]) || req.body['language'] || req.query['language'] || req.params['language'];
    console.log(language);

    if(!language) throw new ErrorHandler(400, 'language not set'); //check if found this language

    const {location, question, answers, rightAnswer} = req.body;

    const areaFound = await AreaModel.findOne({_Id: location});
    if(!areaFound) throw new ErrorHandler(400, 'area not found');
    
    const statistic = []; //statistic prefer.
    answers.map((x,i) => {statistic.push( {answer: i, counter: 0} ) } )

    const data = {location, question, answers, rightAnswer, language, statistic};
    let result = await new QuestionModel( data ).save();
    if(!result) new ErrorHandler(400, 'cant save this question');

    const updateArea = await AreaModel.findByIdAndUpdate(location, {$addToSet: {waitingToExpertApproveQuestions: result._id}});
    if(!updateArea) new ErrorHandler(400, 'cant update this question for experts');

    return new Success(200, result);
  });  //error handler 
});


module.exports = questionRouter;