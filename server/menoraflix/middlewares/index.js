//only for routers
const { errorHandler, errorMainHandler, globalErrorMainHandler } = require('./errorHandler.middleware');
const verifyJWT = require('./verifyJWT.middleware');
const validatorUser = require('./validatorUser.middlewawre');
module.exports = {
    verifyJWT
    , errorHandler, errorMainHandler, globalErrorMainHandler
    , validatorUser
};