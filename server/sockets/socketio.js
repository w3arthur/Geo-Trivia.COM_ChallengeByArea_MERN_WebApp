require("dotenv").config();

const limitOfQuestions = Number(process.env.QUESTIONS_QUANTITY);


const { ioTransmitter, receiver } = require("../api");

const { UserModel, QuestionModel, AreaModel ,PlayingTeamModel } = require('../models');

function socketio(io, socket){
const transmitter = async (message, action) => await ioTransmitter(io, message, action)


receiver(socket, 'getQuestion', async (message) =>  {
    const {playingTeam} = message;
    await transmitter(playingTeam._id, async()=>{
        playingTeamId = playingTeam._id;
        const team = await PlayingTeamModel.findById( playingTeamId );
        if(!team) throw 'no team';
        //const length = team.length; ///////???????????????????
        let { currentQuestion }  = team;
        const { players }  = team;
        if(currentQuestion  >= limitOfQuestions - 1 ) return {finish: true}; // fix
        const currentQuestionFinished = players.filter( (x) => x.currentQuestion < currentQuestion - 1  ); //Fix equality    //? && x.currentQuestion !== -1
        if(currentQuestionFinished.length === 0 ) {
            currentQuestion ++;
            await PlayingTeamModel.findByIdAndUpdate( playingTeamId, { $set: { currentQuestion: currentQuestion }} );
        }

        return ({getQuestion: true,currentQuestion: currentQuestion}); //start play to all!
        // throw 'no user';
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
