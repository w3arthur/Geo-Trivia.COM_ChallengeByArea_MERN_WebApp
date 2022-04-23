const {MiddlewareError} = require("../classes");
const Joi = require("joi");

function validatorUser(req, res, next) {
  console.log(':: login validator middleware');
    const { error } =  Joi.object({
      name: Joi.string().min(3).max(50).required()
      //, age: 
      , email: Joi.string().email().required()
      , password: Joi.string().required()
      }).validate(req.body);
    if (error && error.details) 
      return next( new MiddlewareError(400, 'validation user login info error', error.details[0].message.toString()) );
    next();
}


module.exports = validatorUser;