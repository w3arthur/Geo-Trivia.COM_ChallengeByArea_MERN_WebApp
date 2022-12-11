
const { logEvents, dateTime } = require('../api').logEvent;
const { NodeJSLoggingModel, NodeJSErrorModel } = require('../models/nodeJsLogging.model');
const { ErrorHandler } = require('../classes')
//Global variables:
// error.status
// req.body.isError
// req.resultStatus
// req.resultJson
// req.resultMessage
//routers error
const errorHandler = (req, res, next) => {
    return async (externalFunction) => {
        try {
            const success = await externalFunction();
            if (typeof (success) === 'object') {
                const { status, result } = success;
                req.resultStatus = status;
                if (!result) return res.sendStatus(status);
                try { req.resultJson = JSON.parse(JSON.stringify(result)); } //result is json
                catch (e) { req.resultMessage = result; return res.status(status).send(result); }
                return res.status(status).json(result);
            }
            throw new ErrorHandler(400, 'Success message failed (no return / throw set inside errorHandler for the CRUD operation!) !');
        } catch (err) {
            console.log('...errored');
            req.body.isError = true;
            return next(err); // error handler
        } finally { if (!req.body.isError) { console.log('...logged'); return logger(req, res, next); } }
    }
};


const logger = async (req, res, next) => {
    try {
        //classes global (req. ) used from: MiddlewareError, ErrorHandler
        req.url = req.globalUrl || req.url || req.path;    //fixing url path issue
        let body = req.body; if (req.body.password) { body = JSON.parse(JSON.stringify(req.body)); delete body.password; }
        logEvents(`${dateTime} :: ${req.method}\t${req.headers.origin}\t${req.url}`, 'reqLog.txt');
        console.log(`${dateTime} :: ${req.method} ${req.url} `);


        await new NodeJSLoggingModel({
            user: req.user, method: req.method, url: req.url || req.path, body: body, headers: req.headers, cookies: req.cookies, params: req.params
            , resultStatus: req.resultStatus || 200, resultMessage: req.resultMessage || '', resultJson: req.resultJson || {}
        }).save();
    } catch (err) { return; }  //error handler
}

const globalErrorMainHandler = async (err, req, res, next) => {
    console.log(':: Global Error Handler!');
    err.status = 500;
    err.message = 'Error, Server Mistake issue!, ' + err.message;
    return errorMainHandler(err, req, res, next);
}

const errorMainHandler = async (err, req, res, next) => {
    logEvents(`${err.message?.status || err.name}: ${err.message?.message || err.message}`, 'errLog.txt');
    console.error(':: Error Handler! ' + err.status + ' ' + err.message);
    let body = req.body; if (req.body?.password) { body = JSON.parse(JSON.stringify(req.body)); delete body.password; }
    await new NodeJSErrorModel({
        title: err.message?.title, user: req.user, method: req.method, url: req.url || req.path, body: body, headers: req.headers, params: req.params
        , status: err.message?.status || err.status || 500, errorName: err.name, errorMessage: err.message?.message || err.message
    }).save();
    return res.status(err?.message?.status || err.status || 500).send(err.message?.message || err.message);
}

module.exports = { errorHandler, logger, errorMainHandler, globalErrorMainHandler };

