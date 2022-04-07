//if (process.env.NODE_ENV !== 'production') 
require('dotenv').config();
const { UserModel } = require("../routers/user.router");
const error = require('../api/errorMessage.router');

const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  try{
    const authHeader = req.headers['authorization'] || req.header['x-auth-token'] || req.body['token'] || req.query['token'];
    const token = authHeader && authHeader?.split(' ');
    console.log('the token ', authHeader?.toString());
    if (!token || token[0] != 'Bearer' || !token[1]) throw error(401, 'No Token Supplied, Access denied.');
    jwt.verify(token[1], process.env.ACCESS_TOKEN_SECRET
      , async(err, userTokenValues) => {
        if (err) {console.log(err); throw error(403, 'Token Error, No Access.');}
        //req.user = userValue; //return req.user to next level
        let user = await UserModel.findOne({ _id: userTokenValues.user_id }); //get type from _id (get all the user)
        //console.log('id', userTokenValues.user_id);
        //console.log('userTokenValues', userTokenValues);

        if(!user) throw error(403, 'No user found for this token, No Access.');

        req.user = user;  //console.log(userTokenValues);
        next();
      }
    );
  } catch(err){ return next( err(req) ); }  //error handler
};

