const { format } = require('date-fns');
const { v4: uuid } = require('uuid');
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
//const error = require('../api/errorMessage.router');
const dateTime = `${format(new Date(), 'yyyy/MM/dd HH:mm:ss')}`;
const logsPath = path.join(__dirname, '..', 'logs');

const logEvents = async (message, logName) => {
    try {
        const logItem = `${dateTime}\t${uuid()}\t${message}\n`;
        if (!fs.existsSync( logsPath ))  await fsPromises.mkdir( logsPath );
        await fsPromises.appendFile(path.join(logsPath, logName), logItem);
    } catch (err) { console.log('file error' + err); }
}

const logger = async (req, res, next) => {
    try{
        //classes global (req. ) used from: MiddlewareError, ErrorHandler
        req.url = req.globalUrl || req.url ||req.path;    //fixing url path issue
        let body = req.body; if (req.body.password){ body = JSON.parse(JSON.stringify(req.body)); delete body.password; }
        logEvents(`${dateTime} :: ${req.method}\t${req.headers.origin}\t${req.url}`, 'reqLog.txt');
        console.log(`${dateTime} :: ${req.method} ${req.url} `);
        await new NodeJSLoggingModel({ 
            localTime: dateTime, user: req.user, method: req.method, url: req.url || req.path, body: body, headers: req.headers, params: req.params
            , resultStatus: req.resultStatus || 200, resultMessage: req.resultMessage || '', resultJson: req.resultJson || {}
        }).save();
    } catch(err){  return; }  //error handler
}

const globalErrorHandler = async (err, req, res, next) => {
    console.log(':: Global Error Handler!');
    err.status = 500;
    err.message = 'Error, Server Mistake issue!, ' + err.message;
    return errorHandler(err, req, res, next);
}

const errorHandler = async (err, req, res, next) => {
    try{ err.message = JSON.parse(err.message); }catch(e){}
    logEvents(`${err.message?.status || err.name}: ${err.message?.message || err.message}`, 'errLog.txt');
    console.error(':: Error Handler! ' + err.status + ' ' + err.message); 
    let body = req.body; if (req.body?.password){ body = JSON.parse(JSON.stringify(req.body)); delete body.password; }
    await new NodeJSErrorModel({
        title: err.message?.title, localTime: dateTime, user: req.user, method: req.method, url: req.url || req.path, body: body, headers: req.headers, params: req.params
        , status: err.message?.status || err.status || 500, errorName: err.name, errorMessage: err.message?.message || err.message
    }).save();
    return res.status(err?.message?.status || err.status || 500).send( err.message?.message || err.message );
}

module.exports = { logger, logEvents, errorHandler, globalErrorHandler };


//module and validator

const {mongoose, mongooseLogging} = require("../connection"); 

const NodeJSLoggingModel = mongooseLogging.model( 
    "NodeJs_Logging"  //nodejs_loggings
    , basedLoggingSchema({ resultStatus: { type: Number }, resultMessage: { type: String } , resultJson: { type: Object } }) 
);

const NodeJSErrorModel = mongooseLogging.model( 
    "NodeJs_Error" //nodejs_errors
    , basedLoggingSchema({ status: { type: Number }, errorName: { type: String } , errorMessage: { type: String } })
);

function basedLoggingSchema (additionalObjects){
    return new mongoose.Schema({
    ...additionalObjects
    , title: { type: String }
    , localTime: { type: String }
    , method: { type: String }
    , user: {type: Object}
    , url: { type: String }
    , body: { type: Object }
    , headers: { type: Object }
    , toDelete: { type: Boolean, default: false}
    , params: {type: Object}
  }, { timestamps: true, })
}

