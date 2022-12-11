const {MiddlewareError} = require("../classes");
const Joi = require("joi");


function validatorUser(req, res, next) {
  let errStatus;
  console.log(':: login validator middleware');
    const { error } =  Joi.object({
      name: Joi.string().min(8).regex(/^[A-Za-z]{8,}$/).required()
        .error(errors => { errors.forEach(err => {switch (err.code) {
          case "any.empty": err.message = "name should not be empty!";errStatus = 472; break;
          case "string.min": err.message = `name should have at least ${err.local.limit} characters!`;errStatus = 472; break;
          default: err.message = `name should have only characters!`;errStatus = 472; break;
        }});return errors;})
      , password: Joi.string().min(6).regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/).required()
        .error(errors => { errors.forEach(err => {switch (err.code) {
          case "any.empty": err.message = "password should not be empty!"; errStatus = 461; break;
          case "string.min": err.message = `password should have at least ${err.local.limit} characters!`;errStatus = 461; break;
          default: err.message = `should have 1 special and 1 number`;errStatus = 461; break;
        }});return errors;})
      //, password2: Joi.ref('password')
      }).validate(req.body);
    if (error && error.details) 
      return next( new MiddlewareError( errStatus || 400, 'validation user login info error', error.details[0].message.toString()) );
    next();
}


module.exports = validatorUser;