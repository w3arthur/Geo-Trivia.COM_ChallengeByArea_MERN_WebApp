require('dotenv').config();
//if (process.env.NODE_ENV !== 'production'){  }

const express = require("express");
const router = express.Router();
const { UserModel } = require("./user.router");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const accessTokenTimeOut = process.env.ACCESS_TOKEN_TIMEOUT;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
const refreshTokenTimeOut = process.env.REFRESH_TOKEN_TIMEOUT;
const cookieName= process.env.REFRESH_TOKEN_COOKIE_NAME;
const cookieTimeout = 24 * 60 * 60 * 1000;  //1day

function generateAccessToken(user) { return jwt.sign( user, accessTokenSecret, { expiresIn: accessTokenTimeOut } ); }
const cookieSettings = { httpOnly: true, sameSite: 'None', secure: true, maxAge: cookieTimeout }; 

let refreshToken_List = [];  //set it to database

router.route('/') //  /api/login
  .post( validateUser, async (req, res) => {  //add try catch
    let email = req.body.email;
    let user = await UserModel.findOne({ email: email });
    if (user === null)  return res.status(400).send("user or password is not correct!");
    if(!await bcrypt.compare(req.body.password, user.password))
        return res.status(400).send("user or password is not correct!");
    const accessToken = generateAccessToken({ user_id: user._id, email: user.email });
    const refreshToken = jwt.sign({ user_id: user._id, email: user.email }, refreshTokenSecret, { expiresIn: refreshTokenTimeOut } );
    refreshToken_List.push({user_id: user._id.toHexString(), token: refreshToken});
    res.cookie(cookieName, refreshToken, cookieSettings) //change
      .json({ email: user.email, accessToken: accessToken, refreshToken: refreshToken }); //add type/role and name
  })
  .patch( (req, res) => {
    console.log('token refresh');
    const refreshToken = ( req.cookies && req.cookies[cookieName]) || req.headers['authorization'] || req.header['x-auth-token'] || req.body['token'] || req.query['token'];
    if(!refreshToken) return res.status(401).send('Refresh Token missing.');
    jwt.verify(refreshToken, refreshTokenSecret, (err, userTokenValue) => {
        if(err) return res.status(403).send('Wrong Refresh Token supplied.');
        if(!refreshToken_List.find(x => x.user_id == userTokenValue.user_id)) return res.status(403).send('Refresh Token not stored.');
        const accessToken = generateAccessToken({ user_id: userTokenValue.user_id, email: userTokenValue.email });//(user)
        return res.status(200).json({email: userTokenValue.email, accessToken: accessToken}); //add type/role and name //fix get email/name from database
    });
  })
  .delete( (req, res) => {
    const refreshToken = ( req.cookies && req.cookies[cookieName]) || req.headers['authorization'] || req.header['x-auth-token'] || req.body['token'] || req.query['token'];
    if(!refreshToken) return res.sendStatus(204);
    if( req.cookies && req.cookies[cookieName] ) res.clearCookie(cookieName ,cookieSettings);
    jwt.verify(refreshToken, refreshTokenSecret, (err, userTokenValue) => {
      if(!err) refreshToken_List = refreshToken_List.filter(x => x.user_id != userTokenValue.user_id);
    });
    return res.sendStatus(204);
  })
  ;
module.exports = router;

function validateUser(req, res, next) { 
  const { error } =  Joi.object({
    email: Joi.string().email().required()
    , password: Joi.string().required()
    }).validate(req.body);
  if (error && error.details)  return res.status(400).send(error.details[0].message.toString());
  next();
}
