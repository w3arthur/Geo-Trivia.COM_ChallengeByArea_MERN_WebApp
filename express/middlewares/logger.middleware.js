const { format } = require('date-fns');
const { v4: uuid } = require('uuid');

const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

//const error = require('../api/errorMessage.router');

const dateTime = `${format(new Date(), 'yyyy/MM/dd HH:mm:ss')}`;

const logEvents = async (message, logName) => {
    try {
        const logItem = `${dateTime}\t${uuid()}\t${message}\n`;
        if (!fs.existsSync(path.join(__dirname, '..', 'logs')))  await fsPromises.mkdir(path.join(__dirname, '..', 'logs'));
        await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logName), logItem);
    } catch (err) { console.log(err); }
}

const logger = async (req, res, next) => {
    try{
        if(!req.body.isError){  //there is an error log
            let body = req.body; if (req.body.password){ body = JSON.parse(JSON.stringify(req.body)); delete body.password; }
            logEvents(`${dateTime} :: ${req.method}\t${req.headers.origin}\t${req.url}`, 'reqLog.txt');
            console.log(`${dateTime} :: ${req.method} ${req.url} \t${JSON.stringify(body)}\t${JSON.stringify(req.headers)} `);
            await new NodeLoggingModel({ 
                localTime: dateTime, user: req.user, method: req.method, url: req.url, body: body, headers: req.headers, params: req.params
            }).save();

           // next();
        }
    } catch(err){  return next( err(req) ); }  //error handler
}

const errorHandler = async (err, req, res, next) => {
    // no try/ catch
    logEvents(`${err.name}: ${err.message}`, 'errLog.txt');
    console.error('Error Handler! ' + err.status + ' ' + err.message); 
    let body = req?.body; if (req?.body?.password){ body = JSON.parse(JSON.stringify(req.body)); delete body.password; }
    await new NodeErrorModel({ 
        localTime: dateTime, user: req.user, method: req?.method, url: req?.url, body: body, headers: req?.headers, params: req?.params
          , status: err.status || 500, errorName: err?.name, errorMessage: err?.message
    }).save();
    if(!err.status)
        return res.status(500).send('Error, Server Mistake issue!, ' + err.message);
    return res.status(err.status).send(err.message);
}

module.exports = { logger, logEvents, errorHandler };


const {mongoose, mongooseLogging} = require("../connection"); 

//module and validator
const NodeLoggingModel = mongooseLogging.model( 
    "NodeJs_Logging"  //nodejs_loggings
    , basedLoggingSchema({  }) 
);

const NodeErrorModel = mongooseLogging.model( 
    "NodeJs_Error" //nodejs_errors
    , basedLoggingSchema({ status: { type: Number }, errorName: { type: String } , errorMessage: { type: String } })
);

function basedLoggingSchema (additionalObjects){
    return new mongoose.Schema({
    ...additionalObjects
    , localTime: { type: String }
    , method: { type: String }
    , user: {type: Object}
    , url: { type: String }
    , body: { type: Object }
    , headers: { type: Object }
    , toDelete: { type: Boolean, default: false}
    , params: {type: Object}
    , result: { type: Object }
  }, { timestamps: true, })
}

