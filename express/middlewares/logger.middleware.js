const { format } = require('date-fns');
const { v4: uuid } = require('uuid');

const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const dateTime = `${format(new Date(), 'yyyy/MM/dd HH:mm:ss')}`;

const logEvents = async (message, logName) => {
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`;
    try {  if (!fs.existsSync(path.join(__dirname, '..', 'logs')))  await fsPromises.mkdir(path.join(__dirname, '..', 'logs'));
        await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logName), logItem);
    } catch (err) { console.log(err); }
}

const logger = async (req, res, next) => {
    let body = req.body; if (req.body.password){ body = JSON.parse(JSON.stringify(req.body)); delete body.password; }
    logEvents(`${dateTime} :: ${req.method}\t${req.headers.origin}\t${req.url}`, 'reqLog.txt');
    console.log(`${dateTime} ::${req.method} ${req.url} \t${JSON.stringify(body)}\t${JSON.stringify(req.headers)} `);
    await new NodeLoggingModel({ 
        localTime: dateTime, method: req.method, url: req.url, body: body, headers: req.headers, params: req.params
    }).save();

    next();
}

const errorHandler = async (err, req, res, next) => {
    logEvents(`${err.name}: ${err.message}`, 'errLog.txt');
    console.error('Error Handler! '); 
    let body = req?.body; if (req?.body?.password){ body = JSON.parse(JSON.stringify(req.body)); delete body.password; }
    await new NodeErrorModel({ 
        localTime: dateTime, method: req?.method, url: req?.url, body: body, headers: req?.headers, params: req?.params
         , errorName: err?.name, errorMessage: err?.message
    }).save();

    return res.status(500).send('Error, Server Mistake issue!, ' + err.message);
}

module.exports = { logger, logEvents, errorHandler };


const {mongoose, mongooseLogging} = require("../connection"); 

//module and validator
const NodeLoggingModel = mongooseLogging.model( 
    "NodeLogging"  /*nodeloggings*/ 
    , basedLoggingSchema({}) 
);

const NodeErrorModel = mongooseLogging.model( 
    "NodeError" /*nodeerrors*/
    , basedLoggingSchema({ errorName: { type: String } , errorMessage: { type: String } /*, result: { type: Object }*/})
);

function basedLoggingSchema (additionalObjects){
    return new mongoose.Schema({
    ...additionalObjects
    , localTime: { type: String }
    , method: { type: String }
    , url: { type: String }
    , body: { type: Object }
    , headers: { type: Object }
    , toDelete: { type: Boolean, default: false}
    , params: {type: Object}
  }, { timestamps: true, })
}

