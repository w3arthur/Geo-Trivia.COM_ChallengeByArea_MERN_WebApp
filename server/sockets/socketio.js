const {questions} = require('../config');
const limitOfQuestions = questions.QUESTIONS_QUANTITY;

const { ioTransmitter, receiver } = require("../api");

const { UserModel, QuestionModel, AreaModel ,PlayingTeamModel } = require('../models');


function socketio(io, socket){
const transmitter = async (message, action) => await ioTransmitter(io, message, action)


receiver(socket, 'boomHandler', async (message) =>  {
    const {follower: followerId, followed: followedId, playingTeam: playingTeamId} = message;
    await transmitter(playingTeamId, async()=>{
        const playingTeam = await PlayingTeamModel.findById( playingTeamId );   //{currentQuestion: 1, players: 1}
        if(!playingTeam) throw 'no team';
        const {currentQuestion, players} = playingTeam;
        const playerId = followerId;

        //followId  //check
        //authId  //check

        const filter0 = {_id: playingTeamId, "players._id": playerId};
        const data0 = { $set: {"players.$.answers.$[].answer" : -1, "players.$.boom": true, "players.$.currentQuestion": limitOfQuestions - 1 } }  ;
        const updateUserBoom = await PlayingTeamModel.findOneAndUpdate( filter0, data0 );

        return {unFollowOriginalFollower: true, for: followedId, boomToFirstFollower: true }
    });
});


receiver(socket, 'followAnswerReturn', async (message) =>  {
    const {follower: followerId, followed: followedId, playingTeam: playingTeamId} = message;
    await transmitter(playingTeamId, async()=>{
        const playingTeam = await PlayingTeamModel.findById( playingTeamId );
        if(!playingTeam) throw 'no team';
        const {currentQuestion} = playingTeam;
        const playerId = followedId;
        const player = playingTeam.players.find((x) => x._id === playerId);
        const followedAnswer = player.answers[currentQuestion].answer;// TO FIX!

        //followId  //check
        //authId  //check
        return {followReturn: true,  for: followerId, followedAnswer: followedAnswer}
    });
});

receiver(socket, 'followQuestion', async (message) =>  {
    const {auth: authId, playingTeam : playingTeamId, followed: followId} = message;
    await transmitter(playingTeamId, async()=>{
        const playingTeam = await PlayingTeamModel.findById( playingTeamId );
        if(!playingTeam) throw 'no team';
        const {currentQuestion, players} = playingTeam;
        //followId  //check
        //authId  //check

        // the followId answered this question (no need to follow him)
        const currentPlayer = players.find( (x) => { return x._id === followId }  ); 
        const currentAnswer = currentPlayer.answers[currentQuestion];


        if( currentAnswer.answer !== -1 ) return {followReturn: true,  for: authId, followedAnswer: currentAnswer.answer}

        return {follow: true,  followId: followId,  followerId: authId}
    });
});

receiver(socket, 'getQuestion', async (message) =>  {
    const {playingTeam : playingTeamData} = message;
    await transmitter(playingTeamData._id, async()=>{
        const playingTeamId = playingTeamData._id;
        const playingTeam = await PlayingTeamModel.findById( playingTeamId );
        if(!playingTeam) throw 'no team';
        let { currentQuestion }  = playingTeam;
        const { players }  = playingTeam;

        const currentQuestionFinished = players.filter( 
            (x) => {
                return x.currentQuestion >= currentQuestion
            }  ); //Fix equality 
        
        let stopLoader = false;
        let stopFollowerCheck = false;
        if(currentQuestionFinished.length === players.length ) {    //update question current number
            if(currentQuestion  >= limitOfQuestions - 1 ){  //game end
                if(!playingTeam.gameDone){ try{await statisticUpgrade(playingTeam)}catch(e){console.log('STATISTIC ERROR')}}
                return {finish: true}
            }; //game end
            currentQuestion ++;
            stopLoader = true;
            stopFollowerCheck = true; 
            await PlayingTeamModel.findByIdAndUpdate( playingTeamId, { $set: { currentQuestion: currentQuestion }} );
        }

        return ({getQuestion: true,currentQuestion: currentQuestion, stopLoader: stopLoader, stopFollowerCheck: stopFollowerCheck}); //start play to all!
    });
});

receiver(socket, 'playingTeamSet', async (message) =>  {
    const {playingTeam} = message;
    await transmitter(playingTeam._id, async()=>{
        const playingTeamId = playingTeam._id;
        //const result = await PlayingTeamModel.findById( playingTeamId );
        return ({playingTeamSet: true}); //start play to all!
        // throw 'no user';
    });
});

receiver(socket, 'playingTeamAddUser', async (message) =>  {
    const {player: playerId, playingTeam : playingTeamId} = message;
    await transmitter(playingTeamId, async()=>{

        if(!playerId) throw 'no player id';
        if(!playingTeamId) throw 'no playing team id';

        const result = await PlayingTeamModel.findById( playingTeamId );
        const players = result.players;
        const filter = players.filter( (x) => x._id === playerId );
        
        if(filter.length !== 0 ) return ({userAccepted: true}); // FIX Latter to only one result, not an array
        throw 'no user';
    });
} );


}//end socketio

module.exports = socketio;

async function statisticUpgrade(playingTeam){   //final gaming action
  //Update Statistic data
    const {_id, players, questions} = playingTeam;
    console.log('team_id')
    console.log(_id.toString())
    const filter0 = {_id: _id.toString() }; 
    const data0 = {gameDone: true } ;
    await PlayingTeamModel.findOneAndUpdate(filter0, data0);
    
    players.map( async(player)=>{
        const {_id: playerId} = player;
        let counter = 0;
        player.answers.map( async(x, i) => {
            const {answer, question} = x;
            try{
                const filter1 = {_id: question.toString(), statistic: { "$not": {"$elemMatch": {answer: answer}} } }; 
                const data1 = {$addToSet: { statistic: {answer: answer, counter: 0} } }  ;
                await QuestionModel.findOneAndUpdate(filter1, data1);   //create if not exist
                const filter2 = {_id: question.toString(), "statistic.answer" : answer }; 
                const data2 = {$inc: { "statistic.$.counter": 1, displayedCounter: 1 } }  ;
                await QuestionModel.findOneAndUpdate(filter2, data2);   //increment by 1
                }catch(e){}
            if(answer === questions[i].rightAnswer) counter ++;
        });//end catch
        try{    //set counter to user score  
            const filter3 = {_id: playerId.toString()};
            const data3 = { $inc: {answeredQuestions: counter, totalScore: counter} }  ;
            await UserModel.findOneAndUpdate( filter3, data3 );
        }catch(e){}
    });
}
