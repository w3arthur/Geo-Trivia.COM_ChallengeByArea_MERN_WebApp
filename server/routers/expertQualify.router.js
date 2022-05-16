const {questions, language} = require('../config');
const languageCookieName = language.COOKIE_NAME;
const radiosPointDiameter = [ ...questions.POINTS_CLOSER_AREA_DIAMETER ];
const requiredQuestionsQuantity = questions.QUESTIONS_QUANTITY;
const requireAnswersForExpert = questions.EXPERT_REQUIRED_LEVEL;

const express = require("express");
const expertQualifyRouter = express.Router();

const { errorHandler } = require('../middlewares');
const { Success, MiddlewareError, ErrorHandler } = require('../classes');

const { UserModel, QuestionModel, AreaModel ,PlayingTeamModel, ExpertQualifyModel } = require('../models');


expertQualifyRouter.route('/x') 
.get( async (req, res, next) => { //  localhost:3500/api/expert/qualify/x
  console.log(':: playing expert qualify router get');
  errorHandler(req, res, next)( async () => {

    const player = {aaa: 'aaa'};
    const location = {coordinates: [0, 0]};
    const language = 'english';
    const questions = [{aaa:'aaa'}, {bbb: 'bbb'}]
    const answers = [];
    const data= {player: player, location: location, language: language, questions: questions, answers: answers};
    const result = await new ExpertQualifyModel(data).save();
    if(!result) throw new Error();

    return new Success(200, result);

  });
} );



async function turnIntoExpert_Success(playerId, areaId){

        const area = await AreaModel.findById(areaId); 

        const data1 = {$addToSet: {expertAreas: {_id: area._id, country: area.country, area: area.area}}};
        const updatedUser = await UserModel.findByIdAndUpdate(playerId, data1);
        if(!updatedUser._id) throw new Error();


        const data2 = {$addToSet: {experts: playerId}};
        const updatedArea = await AreaModel.findByIdAndUpdate(areaId, data2); 
        if(!updatedArea._id) throw new Error();

        const result = await UserModel.findById(playerId);
        const resultClone = JSON.parse(JSON.stringify(result))
        delete resultClone.password;
        resultClone.expert = true;
        return new Success(200, resultClone);
}





expertQualifyRouter.route('/:playerId') 
.get( async (req, res, next) => {  //  localhost:3500/api/expert/qualify/:playerId
  console.log(':: playing expert qualify router get question');
  errorHandler(req, res, next)( async () => {

    const requiredQuestions = requiredQuestionsQuantity;

    const {area: areaId} = req.query;
    const { playerId } = req.params;
    const language = req.cookies[languageCookieName];
    if(!language) throw new Error();

    const player = await UserModel.findById( playerId );
    if(!player) throw new ErrorHandler(400, 'cant find your player!');
    const playerClone = JSON.parse(JSON.stringify(player));
    delete playerClone.password;

    const area = await AreaModel.findById( areaId );
    if(!area) throw new Error();
    const { coordinates } = area.location;
    if(!coordinates) throw new Error();
    const location = { coordinates };

    let i = 0;  //find the questions
    let areas, questions;
    const radiosArray = radiosPointDiameter;
    while(i < radiosArray.length){  //find questions for founded areas
      while(i < radiosArray.length){  //find areas for i radios
        const query = { location:{$geoWithin : { $centerSphere: [ coordinates, radiosArray[i] ] } } };
        areas = await AreaModel.find( query, {_id: 1} );
        if(!areas || areas.length === 0) i++;
        else break;
        }
      const areasId = []; //create array of areas id
      areas.map( x => {areasId.push( x._id )} );
      if(!areas || areasId.length === 0) throw new ErrorHandler(400, 'no areas for this radios!');
      questions = await QuestionModel.aggregate([
        { $match : { location: { $in: areasId }, language: language, approved: false } } //language added
        , { $sample: { size: requiredQuestions } } //random X questions
      ]);
      console.log(questions.length);  //to delete
      if(!questions || questions.length < requiredQuestions) i++;
      else break; //success
    }
    if(!questions || questions.length < requiredQuestions) {
        return await turnIntoExpert_Success(playerId, areaId);  //result = {expert: true}
        //throw new ErrorHandler(400, 'not enoughs question found for this erea !');
      }

    const answers = [];
    const data= {player: playerClone, areaId: areaId, location: location, language: language, questions: questions, answers: answers};
    const result = await new ExpertQualifyModel(data).save();
    if(!result) throw new Error();

    return new Success(200, result);
  });  //error handler 
});

expertQualifyRouter.route('/') 
.post(async (req, res, next) => {  //  localhost:3500/api/expert/qualify
  console.log(':: playing expert qualify router post answers');
  errorHandler(req, res, next)( async () => {
    const { triviaId, answers } = req.body;

    const trivia = await ExpertQualifyModel.findById(triviaId);
    if(!trivia) throw new Error();

    const {player, questions, areaId} = trivia;
    const playerId = player._id;

    if(questions.length !== answers.length) throw new Error();

    const rightAnswers = questions.filter((question, i) => question.rightAnswer === answers[i] );

    if(5/ answers.length >= requireAnswersForExpert){  //set as a transaction
        return await turnIntoExpert_Success(playerId, areaId); //result = {expert: true}
    } else {
        const result = {expert: false};
        return new Success(200, result);
      }
  });
});

module.exports = expertQualifyRouter;
