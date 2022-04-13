const {corsOptions, accessAllowed} = require('./accessAllowed.middleware');
const { errorHandler, logger, errorMainHandler, globalErrorMainHandler } = require('./errorHandlerLogging.middleware');
const verifyJWT = require('./verifyJWT.middleware');

module.exports = {
    verifyJWT
    , errorHandler, logger, errorMainHandler, globalErrorMainHandler
    , corsOptions, accessAllowed
};