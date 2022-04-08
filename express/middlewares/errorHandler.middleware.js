const logging = require('../api/loggingFunctions');
const { MiddlewareError } = require('../classes')
//Global variables:
// error.status
// req.body.isError
// req.resultStatus
// req.resultJson
// req.resultMessage

//routers error
const errorHandler = (req, res, next) => {
        return async (externalFunction) => {
            try{
                await externalFunction()
            } catch(err){ return logging.errorHandler(err(req), req, res, next);
            } finally { if(!req.body.isError) return logging.logger(req, res, next) }
        }
};


//routers error message for logging
const middlewareError = (next) => {
    console.log('::Error Handler ::Middleware Error');
    return (middleWareError_Class) =>{
    const {status, title, message} = middleWareError_Class
    return next( new Error( JSON.stringify( new MiddlewareError(status, title, message)) ) )};
};

//routers error message for logging
const error = (errorHandler_Class) => {
    console.log('::Error Handler ::Error');
    const error = new Error(errorHandler_Class.message);
    error.status = errorHandler_Class.status;
    return (req) => {
        req.body.isError = true; 
        return error;
    }      
};

const success = (req, res) => {
    //console.log('::Error Handler ::Success');
    return (success_Class) => {
        const {status, result} = success_Class;
        req.resultStatus = status;
        if(result === undefined) return res.sendStatus(status)
        try{ req.resultJson = JSON.parse(JSON.stringify(result)); }
        catch(e){ req.resultMessage = result; return res.status(status).send(result); }     
        return res.status(status).json(result);
    }      
};

module.exports = {errorHandler, error, success, middlewareError};