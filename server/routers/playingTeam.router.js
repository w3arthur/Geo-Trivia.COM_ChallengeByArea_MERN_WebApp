require("dotenv").config();
const radiosPointDiameter = process.env.POINT_DIAMETER;
const requiredQuestionsQuantity = process.env.QUESTIONS_QUANTITY;

const express = require("express");
const playingTeamRouter = express.Router();

const { errorHandler } = require('../middlewares/errorHandlerLogging.middleware');
const { Success, MiddlewareError, ErrorHandler } = require('../classes');

const { UserModel, QuestionModel, AreaModel ,PlayingTeamModel } = require('../models');


playingTeamRouter.route('/answer')  //  localhost:3500/api/playingTeam/accept
.patch(async (req, res, next) => {
  console.log(':: playing team router put a player');
  errorHandler(req, res, next)( async () => {
    //link from email
    const {playingTeam: playingTeamId, player: playerId, question: questionId, answer: answerValue} = req.body;
    const playingTeam = await PlayingTeamModel.findById(playingTeamId);
    if(!playingTeam) throw new Error(); //no team
    const player = await UserModel.findById(playerId);
    if(!player) throw new Error();  //no user

    //1- check if the question exist!

    const filter1 = {_id: playingTeamId};
    const data1 = {$set: { "players.$[i].answers.$[j].answer": answerValue }};
    const options1 = { arrayFilters: [{"i._id": playerId},{"j.question": questionId}] };
    const questionUpdate = await PlayingTeamModel.findOneAndUpdate( filter1, data1, options1 );
    if (!questionUpdate) throw new Error();

    const updatedPlayingTeam = await PlayingTeamModel.findById(playingTeamId);

    //counter players that answer this question
    const playersAnswered = [];
    updatedPlayingTeam.players.map((x) => {
      x.answers.map((y) => {
        if(y.question.toString() !== questionId && y.answer > -1 ) playersAnswered.push(x);
      })
    });

    console.log(playersAnswered.length)
    console.log(updatedPlayingTeam.players.length)
    if (playersAnswered.length === updatedPlayingTeam.players.length) {
      const filter2 = filter1;
      const data2 = { $inc: {currentQuestion: 1} }  ;
      const playingTeam2 = await updatedPlayingTeam.findOneAndUpdate( filter2, data2 )

      const requiredQuestions = Number(requiredQuestionsQuantity);
      if(requiredQuestions === playingTeam2.currentQuestion + 1){
        const filter3 = filter2;
        const data3 = { $set: {gameDone: true} }  ;
        const playingTeam3 = await updatedPlayingTeam.findOneAndUpdate( filter3, data3 )

        //1- update Questions Statistic


      }
    }
      
  

    return new Success(200, updatedPlayingTeam);

  });
});



playingTeamRouter.route('/accept')  //  localhost:3500/api/playingTeam/accept
.patch(async (req, res, next) => {
  console.log(':: playing team router put a player');
  errorHandler(req, res, next)( async () => {
    //link from email
      const {playingTeam: playingTeamId, player: playerId} = req.body;
      const playingTeam = await PlayingTeamModel.findById(playingTeamId);
      if(!playingTeam) throw new Error(); //no team
      const player = await UserModel.findById(playerId);
      if(!player) throw new Error();  //no user

      const filter = {_id: playingTeamId, "players._id": playerId};
      const data = { $set: {"players.$.accepted" : true} }  ;
      const result = await PlayingTeamModel.findOneAndUpdate( filter, data );
      if (!result) throw new Error();

      return new Success(200, result);

  });
});


playingTeamRouter.route('/player')  //  localhost:3500/api/playingTeam/accept
.patch(async (req, res, next) => {
  console.log(':: playing team router patch a player');
  errorHandler(req, res, next)( async () => {


    //find team and player
    const {playingTeam: playingTeamId, player: playerId} = req.body;
    const playingTeam = await PlayingTeamModel.findById(playingTeamId);
    if(!playingTeam) throw new Error();
    const player = await UserModel.findById(playerId);
    if(!player) throw new Error();
    const playerClone = JSON.parse(JSON.stringify( player ));
    playerClone.password = '';
    playerClone.accepted = true;
    playerClone.answers =  playingTeam.answersModel ;

    if(playingTeam.players.some((x) =>  x._id?.toString() === playerId)) throw new Error();
    const playerCount = playingTeam.players.length + 1;

    const data = {$push:{players: playerClone}, playerCount};
    
    const result = await PlayingTeamModel.findOneAndUpdate( {_id: playingTeamId} , data );

    if (!result) throw new Error();

    return new Success(200, result);
  });
});




playingTeamRouter.route('/') 
.post( async (req, res, next) => {  //  localhost:3500/api/playingTeam/
  console.log(':: playing team router post');
  errorHandler(req, res, next)( async () => {
      const {organizer: organizerId} = req.body;
      
      //get organizer and players data
      const organizer = await UserModel.findById( organizerId );
      if(!organizer || organizer.length === 0) throw new Error();
      organizer.password = '';
          //get gaming language and  location
      const {language, location} = organizer;
      if( !language ) throw new Error();
      const {coordinates} = location;
      if(!coordinates || coordinates.length === 0) throw new Error();
      
      //set gaming questions by area
      const radios = Number(radiosPointDiameter); //in KM
      const requiredQuestions = Number(requiredQuestionsQuantity);
      const query = { language: organizer.language , location:{$geoWithin : { $centerSphere: [ coordinates, radios ] } } };
        //get areas id for coordinates
      const areasArray = await AreaModel.find( query, {_id: 1} );
      const areas = [];
      areasArray.map( x => {areas.push( x._id )} ); 
        //get the required random questions from areas
      const questions = await QuestionModel.aggregate([
          { $match : { location: { $in: areas } } }
          , { $sample: { size: requiredQuestions } } //random X questions
      ]);
      if(!questions || questions.length < requiredQuestions) throw new Error();
      
      //set players, include organizer
      

      const answersModel = [];
      questions.map( (question) => {
          const answer = {
            question: question._id.toString()
            , answer: -1
          };
          answersModel.push(answer)
      } );

      const organizerClone = JSON.parse(JSON.stringify( organizer ));
      organizerClone.accepted = true;
      organizerClone.answers = answersModel;
      const players = [ organizerClone ];
      
      const data = {organizer, players, questions, location, language, answersModel};
      
      const result = await new PlayingTeamModel( data ).save();
      if (!result) throw new Error();

      return new Success(200, result);
  });  //error handler 
});


playingTeamRouter.route('/:playingTeamId') 
.get(async (req, res, next) => {
  console.log(':: playing team router get a player');
  errorHandler(req, res, next)( async () => {
    //get all data for app
      const {playingTeamId} = req.params;
      
      //1- add checker if user not connected more then X time and delete it

      const playingTeam = await PlayingTeamModel.findById( playingTeamId );
      if (!playingTeam) throw new Error();

      //if all the answers complete, set the boolean to true

      return new Success(200, playingTeam);
  });
})













module.exports = playingTeamRouter;
