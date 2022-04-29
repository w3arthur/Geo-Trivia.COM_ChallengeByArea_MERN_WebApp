require("dotenv").config();

const limitOfQuestions = Number(process.env.QUESTIONS_QUANTITY);

const { ioTransmitter, receiver } = require("../api");

const { UserModel, QuestionModel, AreaModel ,PlayingTeamModel } = require('../models');


function socketio(io, socket){
const transmitter = async (message, action) => await ioTransmitter(io, message, action)


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
        if(currentQuestionFinished.length === players.length ) {    //update question current number
            if(currentQuestion  >= limitOfQuestions - 1 ){  //game end
                if(!playingTeam.gameDone){ try{await statisticUpgrade(playingTeam)}catch(e){console.log('STATISTIC ERROR')}}
                return {finish: true}
            }; //game end
            currentQuestion ++;
            await PlayingTeamModel.findByIdAndUpdate( playingTeamId, { $set: { currentQuestion: currentQuestion }} );
        }

        return ({getQuestion: true,currentQuestion: currentQuestion}); //start play to all!
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
    const {player, playingTeam} = message;
    await transmitter(playingTeam._id, async()=>{

        const playingTeamId = playingTeam._id;
        const playerId = player._id;

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




async function statisticUpgrade(playingTeam){
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
