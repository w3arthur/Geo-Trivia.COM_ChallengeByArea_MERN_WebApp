const { auth } = require('../config');
const accessTokenSecret = auth.ACCESS_TOKEN_SECRET;

const jwt = require("jsonwebtoken");

const { UserModel } = require("../models");
const { MiddlewareError } = require('../classes');

module.exports = function (req, res, next) {
  try{  console.log(':: token middleware');
    const authHeader = req.headers['authorization'] || req.header['x-auth-token'] || req.body['token'] || req.query['token'];
    const token = authHeader && authHeader?.split(' '); ///get out the Token from Bearer Token
    if (!token || token[0] !== 'Bearer' || !token[1]) return next( new MiddlewareError(401, 'token middleware error, no token for request', 'No Token Supplied, Access denied.') )
    jwt.verify(token[1], accessTokenSecret
      , async(err, userTokenValues) => {
        if (err) { return next( new MiddlewareError(403, 'token middleware error, wrong token', 'Token Error, No Access.') ); }
        //req.user = userValue; //return req.user to next level
        let user = await UserModel.findOne({ _id: userTokenValues.user_id }); //get type from _id (get all the user)
        //console.log('id', userTokenValues.user_id);
        //console.log('userTokenValues', userTokenValues);
        if(!user) return next( new MiddlewareError(403, 'token middleware error, no found user for this token', 'No user found for this token, No Access.') )
        req.user = user;  //console.log(userTokenValues);
        next();
      }
    );
    } catch(e){ return next( new MiddlewareError(500, 'token middleware error, token system fail', 'token system fail') ); }
};
