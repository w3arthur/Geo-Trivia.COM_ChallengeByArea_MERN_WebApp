const Joi = require("joi");

function validatorFlower (req, res, next) {
    console.log(':: flower validator middleware');
    const { error } =  Joi.object({
        name: Joi.string().min(4).max(50).required()
        , price: Joi.number().min(1).required()
        , color: Joi.string()
        , image: Joi.string()
        , type: Joi.string()
      }).validate(req.body);
    //error message for middleWhere
    if (error && error.details) return next( new MiddlewareError(400, 'validation flower info error', error.details[0].message.toString()) ); //.json(error.details[0].message);  //Error Message
    next();
};

module.exports = validatorFlower;