require("dotenv").config();
const radiosPointDiameter = Number(process.env.POINT_DIAMETER);
const requiredQuestionsQuantity = Number(process.env.QUESTIONS_QUANTITY);


const express = require("express");
const playingTeamRouter = express.Router();

const { errorHandler } = require('../middlewares');
const { Success, MiddlewareError, ErrorHandler } = require('../classes');

const { UserModel, QuestionModel, AreaModel ,PlayingTeamModel } = require('../models');

const  sendEmail  = require('../api/sendEmail');


playingTeamRouter.route('/answer')  //  localhost:3500/api/playingTeam/accept
.patch(async (req, res, next) => {
  console.log(':: playing team router put a player');
  errorHandler(req, res, next)( async () => {
    //link from email
    const {playingTeam: playingTeamId, player: playerId, question: questionNumber, answer: answerValue} = req.body;
    const playingTeam = await PlayingTeamModel.findById(playingTeamId);
    if(!playingTeam) throw new Error(); //no team
    const player = await UserModel.findById(playerId);
    if(!player) throw new Error();  //no user


    const questionId = playingTeam.questions[questionNumber]._id;
    if (!questionId) throw new Error();
    const currentQuestion = playingTeam.currentQuestion;
    //1- check if the question exist!

    // //Boom
    // const players = playingTeam.players;
    // const currentPlayer = players.find( ({_id})=> _id ===  playerId);
    // if(currentPlayer.currentQuestion === -1 ) return 

    const filter1 = {_id: playingTeamId};
    const data1 = {$set: { "players.$[i].answers.$[j].answer": answerValue, "players.$[i].currentQuestion": currentQuestion}};
    const options1 = { arrayFilters: [{"i._id": playerId},{"j.question": questionId}] };
    const questionUpdate = await PlayingTeamModel.findOneAndUpdate( filter1, data1, options1 );
    if (!questionUpdate) throw new Error(); //fix for update errors

    const updatedPlayingTeam = await PlayingTeamModel.findById(playingTeamId);

    //counter players that answer this question
    // const playersAnswered = [];
    // updatedPlayingTeam.players.map((x) => {
    //   x.answers.map((y) => {
    //     if(y.question.toString() !== questionId && y.answer > -1 ) playersAnswered.push(x);
    //   })
    // });

    // console.log(playersAnswered.length)
    // console.log(updatedPlayingTeam.players.length)
    // if (playersAnswered.length === updatedPlayingTeam.players.length) {
    //   const filter2 = filter1;
    //   const data2 = { $inc: {currentQuestion: 1} }  ;
    //   const playingTeam2 = await updatedPlayingTeam.findOneAndUpdate( filter2, data2 )

    //   const requiredQuestions = requiredQuestionsQuantity;
    //   if(requiredQuestions === playingTeam2.currentQuestion + 1){
    //     const filter3 = filter2;
    //     const data3 = { $set: {gameDone: true} }  ;
    //     const playingTeam3 = await updatedPlayingTeam.findOneAndUpdate( filter3, data3 )

    //     //1- update Questions Statistic
    //   }
    // }


    return new Success(200, updatedPlayingTeam);

  });
});



playingTeamRouter.route('/accept')  //  localhost:3500/api/playingTeam/accept
.patch(async (req, res, next) => {
  console.log(':: playing team router patch a player acceptance');
  errorHandler(req, res, next)( async () => {
    //link from email
      const {playingTeam : playingTeamData , player : playerData} = req.body;
      const {_id: playingTeamId} = playingTeamData;
      const {_id: playerId} = playerData;
      const playingTeam = await PlayingTeamModel.findById(playingTeamId);
      if(!playingTeam) throw new Error(); //no team
      const player = await UserModel.findById(playerId);
      if(!player) throw new Error();  //no user

      const filter = {_id: playingTeamId, "players._id": playerId};
      const data = { $set: {"players.$.accepted" : true} }  ;
      const result1 = await PlayingTeamModel.findOneAndUpdate( filter, data );
      if (!result1) throw new Error();

      const result = await PlayingTeamModel.findById(playingTeamId);

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
      const radios = radiosPointDiameter; //in KM
      const requiredQuestions = requiredQuestionsQuantity;
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
            question: question._id.toString() //? the questions are numbered
            , answer: -1
          };
          answersModel.push(answer)
      } );
      const organizerClone = JSON.parse(JSON.stringify( organizer ));
      organizerClone.accepted = true; //!
      organizerClone.currentQuestion = -1;  //!
      organizerClone.answers = answersModel;  //!
      const players = [ organizerClone ]; //! first player
      
      const data = {organizer, players, questions, location, language, answersModel};
      
      const result = await new PlayingTeamModel( data ).save();
      if (!result) throw new Error();

      return new Success(200, result);
  });  //error handler 
})
.patch(async (req, res, next) => {
  console.log(':: playing team router patch a player');
  errorHandler(req, res, next)( async () => {
    //find team and player
    const { playingTeamId, playerEmail} = req.body;
    const playingTeam = await PlayingTeamModel.findById(playingTeamId);
    if(!playingTeam) throw new Error();
    const player = await UserModel.findOne({email: playerEmail});
    if(!player) throw new Error();
    const playerClone = JSON.parse(JSON.stringify( player ));
    playerClone.password = '';
    playerClone.accepted = false;
    playerClone.answers =  playingTeam.answersModel ;

    if(!playingTeam.players.some((x) =>  x.email?.toString() === playerEmail))
    {
    const playerCount = playingTeam.players.length + 1;

    const data = {$push:{players: playerClone}, playerCount};
    
    await PlayingTeamModel.findOneAndUpdate( {_id: playingTeamId} , data );

    await sendEmail(playerEmail, playingTeamId);
    }

    const result = await PlayingTeamModel.findById(playingTeamId);
    if (!result) throw new Error();

    return new Success(200, result);
  });
})



playingTeamRouter.route('/:playingTeamId') 
.get(async (req, res, next) => {
  console.log(':: playing team router get a player');
  errorHandler(req, res, next)( async () => {
    //get all data for app
      const {playingTeamId} = req.params;
      //1- add checker if user not connected more then X time and delete it
      //2- check if the team is from the last 20min!
      const playingTeam = await PlayingTeamModel.findById( playingTeamId );
      if (!playingTeam) throw new Error();

      //if all the answers complete, set the boolean to true
      return new Success(200, playingTeam);
  });
})
.delete(async (req, res, next) => {
  console.log(':: playing team router delete a player');
  errorHandler(req, res, next)( async () => {
    const { playingTeamId } = req.params;
    const { playerId } = req.query;

    const playingTeam = await PlayingTeamModel.findById(playingTeamId);
    if(!playingTeam || !playerId) throw new Error();
   // if( playingTeam.players?.filter((x) => x._id === playerId).length === 0) throw new Error();
      const filter = {_id: playingTeamId, };
      const data = { $pull: {players: { _id: playerId } }   }  ;
      const player = await PlayingTeamModel.findOneAndUpdate( filter, data);
    // const player = await UserModel.updateOne({_id: playingTeamId}, {'$pullAll': { players: [{_id: playerId}] } });
    if(!player) throw new Error();

    const result = await PlayingTeamModel.findById( playingTeamId );

    if (!result) throw new Error();
    console.log(result.players.length)
    return new Success(200, result);
  });
});












module.exports = playingTeamRouter;
