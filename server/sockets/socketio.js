const { ioTransmitter, receiver } = require("../api");

const { UserModel, QuestionModel, AreaModel ,PlayingTeamModel } = require('../models');

function socketio(io, socket){
    const transmitter = async (message, action) => await ioTransmitter(io, message, action)

    receiver(socket, 'playingTeamAddUser', async (message) =>  {
        await transmitter('aaa', async()=>{
            const { playingTeamId } = message;
            try{
                const playingTeam1 = await PlayingTeamModel.findById(playingTeamId);
                if(!playingTeam1) { throw 'no active team'; }
                return ({data: playingTeam});


            }catch(e){ throw 'wrong playing team id'}
            
            
            
        });
    } );

}

module.exports = socketio;



//use mongoDB models
//find team in database AAA
//if no return fail (rejected message)
//set teamId, update userId {accepted: true}
//return the teamId + question
//alert the user that he accepted 
//update the team Id Socket for _Game Organizer_ ({accepted: true})
//delete the X from accepted user
//set email with right accepted address
//handle socket for each specific user for boom
// fix checker  if /:playingTeamId is still available