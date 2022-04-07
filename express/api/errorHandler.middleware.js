const logging = require('./loggingFunctions');

//Global variables:
// error.status
// req.body.isError
// req.resultStatus
// req.resultJson
// req.resultMessage

//routers error
const errorHandler =  (req, res, next) => {
    // errorHandling ( (next, req) => {  } );
        return async (externalFunction) => {
            try{
                await externalFunction()
            } catch(err){ return logging.errorHandler(err(req), req, res, next);
            } finally { if(!req.body.isError) return logging.logger(req, res, next) }
        }
};


//routers error message for logging
const middlewareError = (next) => {
   return (status, title, message) =>{ return next( new Error( JSON.stringify( {status: status , title: title, message: message} ) ) )};
};

//routers error message for logging
const error = (status, message) => {
    const error = new Error(message);
    error.status = status;
    return (req) => {
        //req.body.isError = true; 
        return error;
    }      
};

const success = (req, res) => {
    return (status, result = undefined) => {
        req.resultStatus = status;
        if(result === undefined) return res.sendStatus(status)
        try{ req.resultJson = JSON.parse(JSON.stringify(result)); }
        catch(e){ req.resultMessage = result; return res.status(status).send(result); }     
        return res.status(status).json(result);
    }      
};

module.exports = {errorHandler, error, success, middlewareError};