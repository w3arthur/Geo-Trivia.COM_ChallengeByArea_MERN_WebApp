
const { questions ,language } = require('../config');
const languageCookieName = language.COOKIE_NAME;
const itemsForEachPage = questions.ITEMS_PER_PAGE;  //2

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
      const {page} = req.query;
      const language = req.cookies[languageCookieName];
      const area = await AreaModel.findById( areaId );
      if(!area) throw new ErrorHandler(400, 'cant find the area!');
      const {waitingToExpertApproveQuestions: questionsId} = area;  //[...]

      const nPerPage = itemsForEachPage;
      const pageNumber = page;
      const questions = await QuestionModel.find({_id: {$in: questionsId}, language: language })
                          .limit( nPerPage ).skip( pageNumber > 0 ? ( ( pageNumber - 1 ) * nPerPage ) : 0);
      
      //add limit and page

      const result = {questions: questions};
      if (questions.length < nPerPage) { result.lastPage = true;  }
      return new Success(200, result);
    });  //error handler 
  });

  //send question to approve / delete
  // add auth approvement to be an expert that allowed to do so
expertQuestionsRouter.route('/:questionId')   //  localhost:3500/api/expert/:questionId
  .patch( async (req, res, next) => {
      console.log(':: expert router patch question acceptance');
      errorHandler(req, res, next)( async () => {
        const {questionId} = req.params;
        const {areaId} = req.body;
        const data1 = {$pull: {waitingToExpertApproveQuestions: questionId}}; //check if it object id
        const deleteFromArea = await AreaModel.findByIdAndUpdate( areaId,  data1);
        if(!deleteFromArea._id) throw new Error(); // wrong area to update
        const data2 = {$set: {approved: true}};
        const questionUpdate = await QuestionModel.findByIdAndUpdate(questionId, data2);
        if(!questionUpdate._id) throw new Error();
        return new Success(200, 'ok');
      });  //error handler 
  })
  .delete( async (req, res, next) => {
      console.log(':: expert router delete question and not accept it');
      errorHandler(req, res, next)( async () => {
        const {questionId} = req.params;
        const {areaId} = req.query;
        const data = {$pull: {waitingToExpertApproveQuestions: questionId}}; //check if it object id
        const deleteFromArea = await AreaModel.findByIdAndUpdate( areaId,  data);
        if(!deleteFromArea._id) throw new Error(); // wrong area to update
        const questionDelete = await QuestionModel.findByIdAndRemove( questionId );
        if(!questionDelete._id) throw new Error();
        return new Success(200, 'ok');
      });  //error handler 
  });



module.exports = expertQuestionsRouter;