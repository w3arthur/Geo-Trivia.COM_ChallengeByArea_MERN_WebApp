
const languageCookieName = 'i18next';

const express = require("express");
const userRouter = express.Router();
const bcrypt = require("bcrypt");

const { errorHandler, validatorUser } = require('../middlewares');
const { Success, MiddlewareError, ErrorHandler } = require('../classes');
const { UserModel } = require('../models');



userRouter.route('/') //  localhost:3500/api/user
.post( validatorUser,async (req, res, next) => {
  console.log(':: user router post');
  errorHandler(req, res, next)( async () => {

    const language = ( req.cookies && req.cookies[languageCookieName]) || req.body['language'] || req.query['language'];
    console.log(language);

    const {name, age, email, password} = req.body;
    const user = await UserModel.findOne({ email: email });
    if (user !== null) throw new ErrorHandler(452, 'user already exist!');
    const data = {name, age, email, password};
    if(language) data.language = language;
    data.password = await bcrypt.hash(data.password, 10);
    const result = await new UserModel(data).save();
    
    return new Success(200, result);
    });  //error handler 
})


.put(async (req, res, next) => { //set area for an user
  console.log(':: user router put');
  errorHandler(req, res, next)( async () => {
  const {user : userId, coordinates} = req.body;

    const language = ( req.cookies && req.cookies[languageCookieName]) || req.body['language'] || req.query['language'];
    console.log(language);

    const user = await UserModel.findOne({_id: userId});
    if (!user) throw new ErrorHandler(400, 'no user');

    if (coordinates[0] === 0 && coordinates[1] === 0) throw new ErrorHandler(400, 'no coordinates set');

    const data= {};
    data.language = language;
    if (coordinates){
      const location = { type: 'Point', coordinates };
      data.location = location;
    }

    const result = await UserModel.findByIdAndUpdate(userId, data);

    return new Success(200, user);
  });  //error handler 
})

.get(async (req, res, next) => { 
  console.log(':: user router get');
  errorHandler(req, res, next)( async () => {
    let users = await UserModel.find();
    if (!users) throw new ErrorHandler(400, 'no users');
    return new Success(200, users);
  });  //error handler 
})
;

userRouter.route('/find')
  .get(async (req, res, next) => { 
    const {user} = req.query;
    console.log(':: user router get');
    errorHandler(req, res, next)( async () => {
      let users = await UserModel.findById( user );
      console.log(users)

      if (!users) throw new ErrorHandler(400, 'no users');
      return new Success(200, users);
    });  //error handler 
  })
  ;

module.exports = userRouter;
