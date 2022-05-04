
const languageCookieName = 'i18next';

const express = require("express");
const expertQuestionsRouter = express.Router();

const { errorHandler } = require('../middlewares');
const { Success, MiddlewareError, ErrorHandler } = require('../classes');

const { UserModel, QuestionModel, AreaModel ,PlayingTeamModel, ExpertQualifyModel } = require('../models');

expertQuestionsRouter.route('/:areaId')   //  localhost:3500/api/expert/:areaId
  .get(async (req, res, next) => {
    console.log(':: expert router get questions by userId');
    errorHandler(req, res, next)( async () => {
      const {areaId} = req.params;
      const {page} = req.params;
      const language = req.cookies[languageCookieName];
      const area = await AreaModel.findById( areaId );
      if(!area) throw new ErrorHandler(400, 'cant find the area!');

      const {waitingToExpertApproveQuestions: questionsId} = area;  //[...]
      const questions = await QuestionModel.find({_id: {$in: questionsId}, language: language })//add limit and page
      const result = {questions: questions};
      result.lastPage = true;
      return new Success(200, result);
    });  //error handler 
  });

expertQuestionsRouter.route('/')
  .post( async (req, res, next) => {
      console.log(':: expert router post');
      errorHandler(req, res, next)( async () => {

      });  //error handler 
  });


module.exports = expertQuestionsRouter;