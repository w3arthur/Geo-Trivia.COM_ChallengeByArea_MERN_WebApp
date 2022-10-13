//only for routers
const {corsOptions, accessAllowed} = require('./accessAllowed.middleware');
const { errorHandler, logger, errorMainHandler, globalErrorMainHandler } = require('./errorHandler.middleware');
const verifyJWT = require('./verifyJWT.middleware');
const validatorUser = require('./validatorUser.middlewawre');
module.exports = {
    verifyJWT
    , errorHandler, logger, errorMainHandler, globalErrorMainHandler
    , validatorUser
    , corsOptions, accessAllowed
};