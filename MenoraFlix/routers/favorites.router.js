const { auth, tokens, language } = require('../config');
const accessTokenSecret = auth.ACCESS_TOKEN_SECRET;
const accessTokenTimeOut = auth.ACCESS_TOKEN_TIMEOUT;
const refreshTokenSecret = auth.REFRESH_TOKEN_SECRET;
const refreshTokenTimeOut = auth.REFRESH_TOKEN_TIMEOUT;
const cookieName= auth.REFRESH_TOKEN_COOKIE_NAME;
const cookieTimeout = auth.REFRESH_TOKEN_COOKIE_TIMEOUT;

const express = require("express");
const favoritesRouter = express.Router();

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


const cookieSettings = { httpOnly: true, sameSite: 'None', secure: true, maxAge: cookieTimeout }; 

//let refreshToken_List = [];  //set it to database

const { errorHandler, validatorUser } = require('../middlewares');
const { Success, ErrorHandler } = require('../classes');
const  { UserModel }  = require('../models');

favoritesRouter.route('/add') //  localhost:3500/api/favorites/add
.patch( async (req, res, next) => { //
  console.log(':: user favorites add patch');
  errorHandler(req, res, next)( async () => {
    const { movie } = req.body;
    const { name } = req.user;
    if (!name) throw new ErrorHandler(400, 'no user name!');
    if(!movie) throw new ErrorHandler(400, 'no movie!');
    //const user = await UserModel.findOne({ name: name });
    //if (!user) throw new ErrorHandler(400, 'no user!');
    const update = await UserModel.findOneAndUpdate( { name: name, 'favorites.id': {'$ne': movie.id} }, { $addToSet: { favorites: movie } } );
    return new Success(200, 'ok');
    });  //error handler 
});

favoritesRouter.route('/remove') // localhost:3500/api/favorites/remove
.patch( async (req, res, next) => { //
  console.log(':: user favorites remove patch');
  errorHandler(req, res, next)( async () => {
    const { movie } = req.body;
    const { name } = req.user;
    if (!name) throw new ErrorHandler(400, 'no user name!');
    if(!movie) throw new ErrorHandler(400, 'no movie!');
    const user = await UserModel.findOne({ name: name });
    if (!user) throw new ErrorHandler(400, 'no user!');
    const update = await UserModel.findByIdAndUpdate(user._id, { $pull : { favorites:{id: movie.id} } }, { safe: true, multi:true } )
    return new Success(200, 'ok');
    });  //error handler 
});



favoritesRouter.route('/') //  localhost:3500/api/favorites/
.get( async (req, res, next) => {
  console.log(':: favorites router get');
  errorHandler(req, res, next)( async () => {
    const { name } = req.user;
    const user = await UserModel.findOne({ name: name });
    if (!user) throw new ErrorHandler(400, 'no user!');
    const result = user.favorites;
    console.log(user.favorites);
    return new Success(200, result);
    });  //error handler
})
.patch( async (req, res, next) => {
  console.log(':: favorites un star router patch');
  errorHandler(req, res, next)( async () => {
    const { name } = req.user;
    if (!name) throw new ErrorHandler(400, 'no user name!');
    const user = await UserModel.findOne({ name: name });
    if (!user) throw new ErrorHandler(400, 'no user!');
    const update = await UserModel.findOneAndUpdate( { name: name, 'favorites.stared':  true }, { $set: { 'favorites.$[x].stared': false } }, {  "arrayFilters": [{ 'x.stared': true }], multi:true } );
    return new Success(200, 'ok');
    });  //error handler
});


module.exports = favoritesRouter;


