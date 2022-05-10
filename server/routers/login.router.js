require('dotenv').config();
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const accessTokenTimeOut = process.env.ACCESS_TOKEN_TIMEOUT;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
const refreshTokenTimeOut = process.env.REFRESH_TOKEN_TIMEOUT;
const cookieName= process.env.REFRESH_TOKEN_COOKIE_NAME;
const cookieTimeout = Number( process.env.REFRESH_TOKEN_COOKIE_TIMEOUT );
const googleClientID = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const facebookClientId = process.env.FACEBOOK_CLIENT_ID;
const facebookClientSecret = process.env.FACEBOOK_CLIENT_SECRET;

const languageCookieName = 'i18next';

const express = require("express");
const loginRouter = express.Router();
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

function generateAccessToken(user) { return jwt.sign( user, accessTokenSecret, { expiresIn: accessTokenTimeOut } ); }
const cookieSettings = { httpOnly: true, sameSite: 'None', secure: true, maxAge: cookieTimeout }; 

let refreshToken_List = [];  //set it to database

const { errorHandler, validatorUser } = require('../middlewares');
const { Success, ErrorHandler, MiddlewareError } = require('../classes');

const  {UserModel, UserFacebookModel, UserGoogleModel, QuestionModel, AreaModel ,PlayingTeamModel}  = require('../models');


loginRouter.route('/register') //  localhost:3500/api/login/register //register
.post( validatorUser,async (req, res, next) => {
  console.log(':: user router post');
  errorHandler(req, res, next)( async () => {
    const language = ( req.cookies && req.cookies[languageCookieName]) || req.body['language'] || req.query['language'];
    console.log(language);
    const {name, age, email, password} = req.body;
    const user = await UserModel.findOne({ email: email });
    if (user !== null) throw new ErrorHandler(452, 'user already exist!');
    const data = {name, age, email, password, passwordRegister: true};
    if(language) data.language = language;
    data.password = await bcrypt.hash(data.password, 10);
    const result = await new UserModel(data).save();
    return new Success(200, result);
    });  //error handler 
})



// player accept invitation
loginRouter.route('/acceptTeam')  //  localhost:3500/api/login/acceptTeam
.patch(async (req, res, next) => {
  console.log(':: login acceptTeam router patch a player acceptance');
  errorHandler(req, res, next)( async () => {
    //link from email
      const {playingTeam : playingTeamId , player : playerId} = req.body;
      const playingTeam = await PlayingTeamModel.findById(playingTeamId);
      if(!playingTeam) throw new ErrorHandler(400, 'cant find your playing team!'); //no team
      const player = await UserModel.findById(playerId);
      if(!player) throw new ErrorHandler(400, 'cant find your player!');  //no user

      const filter = {_id: playingTeamId, "players._id": playerId};
      const data = { $set: {"players.$.accepted" : true} }  ;
      const result1 = await PlayingTeamModel.findOneAndUpdate( filter, data );
      if (!result1) throw new ErrorHandler(400, 'cant set your approvement inside playing team!');

      const result = await PlayingTeamModel.findById(playingTeamId);
      return new Success(200, result);
  });
});


loginRouter.route('/') //  /api/login
.post( async (req, res, next) => {
  console.log(':: login router post');
  errorHandler(req, res, next)( async () => {
    const {email} = req.body;
    if (email === '') throw new ErrorHandler(400, 'no email set!');
    const user = await UserModel.findOne({ email: email });
    if(user && !user.passwordRegister && ( user.google || user.facebook ) )
        throw new ErrorHandler(400, 'please connect with google or facebook');
    if (!user) throw new ErrorHandler(400, 'user or password is not correct! retry');
    if(req.body.password?.trim() === '' || !req.body.password?.trim()) throw new ErrorHandler(400, 'no password set');
    if(!await bcrypt.compare(req.body.password, user.password)) throw new ErrorHandler(400, 'user or password is not correct!');
    return loginUserSuccess(user, res); //set auth login
    });  //error handler
})
.patch( (req, res, next) => {
  console.log(':: login router patch');
  errorHandler(req, res, next)( async () => {
  const refreshToken = ( req.cookies && req.cookies[cookieName]) || req.headers['authorization'] || req.header['x-auth-token'] || req.body['token'] || req.query['token'];
  if(!refreshToken) throw new ErrorHandler(401, 'Refresh Token missing.');

  let userTokenValue = jwt.verify(refreshToken, refreshTokenSecret);
  if (!userTokenValue) throw new ErrorHandler(403, 'Wrong Refresh Token supplied.');
  if(!refreshToken_List.find(x => x.user_id === userTokenValue.user_id)) throw new ErrorHandler(403, 'Refresh Token not stored.');
  const accessToken = generateAccessToken({ user_id: userTokenValue.user_id, email: userTokenValue.email });//(user)
  const user = await UserModel.findById( userTokenValue.user_id );
  const userClone = JSON.parse(JSON.stringify(user));
  delete userClone.password;
  userClone.accessToken = 'Bearer ' + accessToken;
  const result = userClone;

  if(!result) throw new Error();
  return new Success(200, result);

  });  //error handler 
})
.delete( (req, res, next) => {
  console.log(':: login router delete');
  errorHandler(req, res, next)( async () => {
    const refreshToken = ( req.cookies && req.cookies[cookieName]) || req.headers['authorization'] || req.header['x-auth-token'] || req.body['token'] || req.query['token'];
    if(!refreshToken) return new Success(200);
    if( req.cookies && req.cookies[cookieName] ) res.clearCookie(cookieName ,cookieSettings);
    jwt.verify(refreshToken, refreshTokenSecret, (err, userTokenValue) => {
      if(!err) refreshToken_List = refreshToken_List.filter(x => x.user_id !== userTokenValue.user_id);
    });
    return new Success(200);
  });  //error handler
})
;


// google login
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client( googleClientID, googleClientSecret);
loginRouter.post("/google", (req, res, next) => { //  /api/login/google
   console.log(':: login router google post');
  errorHandler(req, res, next)( async () => {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({ idToken: token, audience: googleClientID, });
    const payload = ticket.getPayload();

    if(!payload?.email) throw new Error();

    const {name, email, picture} = payload;
    let user = await UserModel.findOne({ email: email});
    if(user && !user.facebook) { user = await UserModel.findByIdAndUpdate( user._id, {$set: {google: true} } );}
    if(!user){  //create new user
      const data0 = { name: name, email: email, image: picture, google: true };
      user = await new UserGoogleModel( data0 ).save();
    }

    if(!user) throw new Error();
    return loginUserSuccess(user, res); //set auth login
  });  //error handler 
});





// facebook login
const fetch = require("node-fetch");
loginRouter.post("/facebook", (req, res, next) => { //  /api/login/facebook
  console.log(':: login router facebook post');
  errorHandler(req, res, next)( async () => {
    const { userId,  token } = req.body;
    let graphUrl = `https://graph.facebook.com/${userId}?fields=id,name,email,picture&access_token=${token}`
    const fetchResult = await fetch(graphUrl, { method: "GET", });
    const fetchResultJson = await fetchResult.json();
    const { name, email, picture, id: fetchId } = fetchResultJson;
    if(fetchId !== userId) throw new Error()

    let user = await UserModel.findOne({ email: email});
    if(user && !user.facebook) { user = await UserModel.findByIdAndUpdate( user._id, {$set: {facebook: true} } );}
    if(!user){  //create new user
      const data0 = { name: name, email: email, image: picture?.data?.url, facebook: true };
      user = await new UserFacebookModel( data0 ).save();
    }

    if(!user) throw new Error();
    return loginUserSuccess(user, res); //set auth login
    });  //error handler 
});


module.exports = loginRouter;



function loginUserSuccess(user, res){ //cookie + accessToken and auth data for login
    const accessToken = generateAccessToken({ user_id: user._id, email: user.email });
    const refreshToken = jwt.sign({ user_id: user._id, email: user.email }, refreshTokenSecret, { expiresIn: refreshTokenTimeOut } );
    refreshToken_List.push({user_id: user._id.toHexString(), token: refreshToken});
    res.cookie(cookieName, refreshToken, cookieSettings); //change
    const data = JSON.parse(JSON.stringify(user));
    delete data.password;
    data.accessToken = 'Bearer ' + accessToken;
    return new Success(200, data);
}
