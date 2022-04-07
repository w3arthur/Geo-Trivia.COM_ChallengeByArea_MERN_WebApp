const { nextDay } = require('date-fns');
const express = require('express');
const loggingRouter = express.Router();
const {mongoose, mongooseLogging} = require("../../connection"); 
const error = require('../../api/errorMessage.router');
const logging = require('../../middlewares/logger.middleware').logger;

loggingRouter.route('/') //  localhost:3000/api/logging
    .post( async (req, res, next) => {
      // errorHandling ( (next, req) => {  } );
      try{

        const {data, number} = req.body;
        if (! req.body) throw error(400, 'no logging 2body, wrong request');
        // throw error(400, 'no logging, wrong request');
        await new LoggingModel({ data, number }).save();
        return res.status(200).send('logging sent');

      } catch(err){ return next( err(req) ); //error handler
      } finally { logging() }
  } );


module.exports = loggingRouter;

//module and validator
const LoggingModel = mongooseLogging.model(
  "React_Logging"  //react_loggings
  , new mongoose.Schema({
    data: { type: String }
    , number: { type: Number }
  }, { timestamps: true, })
);
