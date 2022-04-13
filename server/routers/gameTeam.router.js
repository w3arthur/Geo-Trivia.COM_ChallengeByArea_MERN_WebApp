const express = require("express");
const gameTeamRouter = express.Router();

const { errorHandler } = require('../middlewares/errorHandlerLogging.middleware');
const { Success, MiddlewareError, ErrorHandler } = require('../classes');

const { GameTeamModel } = require('../modules');

gameTeamRouter.route('/:email')   //  localhost:3500/api/gameTeam/:x
  .get(async (req, res, next) => {  //req.params/ req.query
    console.log(':: game team router get by email');
    errorHandler(req, res, next)( async () => {
      //const {...} = req.body;
      //let user = await UserModel.find({/* */});
      //const {id} = user; // got ObjectId
      let result = await GameTeamModel.find({/* */});
      return new Success(200, result);
    });  //error handler 
  });

gameTeamRouter.route('/')
  .post( async (req, res, next) => {
      console.log(':: game team router post');
      errorHandler(req, res, next)( async () => {
        //const {...} = req.body;
       /* const team = await AreaModel.findOne({ ... }); //not required
        if (team === null)  //throw new ErrorHandler(400, 'team not exist!');
        const result = await new GameTeamModel({ ... }).save();
        return new Success(200, result);*/
      });  //error handler 
  });

module.exports = gameTeamRouter;
