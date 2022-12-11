
const { ErrorHandler } = require('../classes')

const errorHandler = (req, res, next) => {
    return async (externalFunction) => {
        try{ 
            const success = await externalFunction();
            if(typeof(success) === 'object'){
                const {status, result} = success;
                req.resultStatus = status;
                if(!result) return res.sendStatus(status);
                try{ req.resultJson = JSON.parse(JSON.stringify(result)); }
                catch(e){ req.resultMessage = result; return res.status(status).send(result); }     
                return res.status(status).json(result);
            }
            throw new ErrorHandler(400, 'Success message failed (no return / throw set inside errorHandler for the CRUD operation!) !');
        } catch(err){
            console.log('...errored');
            return next(err); // error handler
        }
    }
};


const globalErrorMainHandler = async (err, req, res, next) => {
    console.log(':: Global Error Handler!');
    err.status = 500;
    err.message = 'Error, Server Mistake issue!, ' + err.message;
    return errorMainHandler(err, req, res, next);
}

const errorMainHandler = async (err, req, res, next) => {
    console.error(':: Error Handler! ' + err.status + ' ' + err.message); 
    let body = req.body; if (req.body?.password){ body = JSON.parse(JSON.stringify(req.body)); delete body.password; }
    return res.status(err?.message?.status || err.status || 500).send( err.message?.message || err.message );
}

module.exports = { errorHandler, errorMainHandler, globalErrorMainHandler };

