require('dotenv').config();
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const accessTokenTimeOut = process.env.ACCESS_TOKEN_TIMEOUT;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
const refreshTokenTimeOut = process.env.REFRESH_TOKEN_TIMEOUT;
const cookieName= process.env.REFRESH_TOKEN_COOKIE_NAME;
const cookieTimeout = Number( process.env.REFRESH_TOKEN_COOKIE_TIMEOUT );

const express = require("express");
const loginRouter = express.Router();
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


function generateAccessToken(user) { return jwt.sign( user, accessTokenSecret, { expiresIn: accessTokenTimeOut } ); }
const cookieSettings = { httpOnly: true, sameSite: 'None', secure: true, maxAge: cookieTimeout }; 

let refreshToken_List = [];  //set it to database

const { errorHandler } = require('../middlewares');
const { Success, ErrorHandler, MiddlewareError } = require('../classes');

const  UserModel  = require('../models/user.model');
const validateUser = require('../middlewares/validatorUser.middlewawre')

loginRouter.route('/') //  /api/login
.post( validateUser, async (req, res, next) => {
  // console.log(':: login router post');
  errorHandler(req, res, next)( async () => {
    console.log('fgdfgdfgdfgddgfdfg')
    let email = req.body.email;
    let user = await UserModel.findOne({ email: email });
    if (user === null) throw new ErrorHandler(400, 'user or password is not correct!');
    if(!await bcrypt.compare(req.body.password, user.password)) throw new ErrorHandler(400, 'user or password is not correct!');
    const accessToken = generateAccessToken({ user_id: user._id, email: user.email });
    const refreshToken = jwt.sign({ user_id: user._id, email: user.email }, refreshTokenSecret, { expiresIn: refreshTokenTimeOut } );
    refreshToken_List.push({user_id: user._id.toHexString(), token: refreshToken});
    res.cookie(cookieName, refreshToken, cookieSettings); //change
    const data = JSON.parse(JSON.stringify(user));
    data.accessToken = accessToken;
    return new Success(200, data );

    });  //error handler
})
.patch( (req, res, next) => {
  console.log(':: login router patch');
  errorHandler(req, res, next)( async () => {
  //console.log('token refresh');
  const refreshToken = ( req.cookies && req.cookies[cookieName]) || req.headers['authorization'] || req.header['x-auth-token'] || req.body['token'] || req.query['token'];
  if(!refreshToken) throw new ErrorHandler(401, 'Refresh Token missing.');
    jwt.verify(refreshToken, refreshTokenSecret, (err, userTokenValue) => {
        if(err) throw new ErrorHandler(403, 'Wrong Refresh Token supplied.');
        if(!refreshToken_List.find(x => x.user_id === userTokenValue.user_id)) throw new ErrorHandler(403, 'Refresh Token not stored.');
        const accessToken = generateAccessToken({ user_id: userTokenValue.user_id, email: userTokenValue.email });//(user)
        return new Success(200, {email: userTokenValue.email, accessToken: accessToken}); //add type/role and name //fix get email/name from database
    });
  });  //error handler 
})
.delete( (req, res, next) => {
  console.log(':: login router delete');
  errorHandler(req, res, next)( async () => {
    const refreshToken = ( req.cookies && req.cookies[cookieName]) || req.headers['authorization'] || req.header['x-auth-token'] || req.body['token'] || req.query['token'];
    if(!refreshToken) return new Success(204, undefined);
    if( req.cookies && req.cookies[cookieName] ) res.clearCookie(cookieName ,cookieSettings);
    jwt.verify(refreshToken, refreshTokenSecret, (err, userTokenValue) => {
      if(!err) refreshToken_List = refreshToken_List.filter(x => x.user_id !== userTokenValue.user_id);
    });
    return new Success(204, undefined);
  });  //error handler
})
;
module.exports = loginRouter;


