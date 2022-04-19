const express = require("express");
const answersRouter = express.Router();

const {mongoose, mongoose1, schemaVersion} = require("../connection");
const { errorHandler } = require('../middlewares/errorHandlerLogging.middleware');
const { Success, MiddlewareError, ErrorHandler } = require('../classes');

const { QuestionModel } = require('../modules');

answersRouter.route('/')   //  localhost:3500/api/invitation/:x
  .post(async (req, res, next) => {  //req.params/ req.query
    console.log(':: invitation router post');
    errorHandler(req, res, next)( async () => {
      //const {...} = req.body;
      //let user = await UserModel.find({/* */});
      //const {id} = user; // got ObjectId
      /*const result = await new InvitationModel({ ... }).save();
      //post an email!
      return new Success(200, result);*/
    });  //error handler 
  });

answersRouter.route('/:token')   //  localhost:3500/api/invitation/:x
  .delete(async (req, res, next) => {  //req.params/ req.query
    console.log(':: invitation router delete');
    errorHandler(req, res, next)( async () => {
      //const {...} = req.body;
      //let invitation = await InvitationModel.find({/* */});
      //???
      //update the team
      //send him the team questions
      //...
    });  //error handler 
  });



module.exports = answersRouter;