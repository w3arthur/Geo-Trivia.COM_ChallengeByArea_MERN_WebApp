//if (process.env.NODE_ENV !== 'production') 
require('dotenv').config();
const { UserModel } = require("../routers/user.router");

const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const authHeader = req.headers['authorization'] || req.header['x-auth-token'] || req.body['token'] || req.query['token'];
  const token = authHeader && authHeader?.split(' ');
  console.log('the token ', authHeader?.toString());
  if (!token || token[0] != 'Bearer' || !token[1]) return res.status(401).send("No Token Supplied, Access denied.");;
  jwt.verify(token[1], process.env.ACCESS_TOKEN_SECRET
    , async(err, userTokenValues) => {
      if (err) {console.log(err); return res.status(403).send("Token Error, No Access.");}
      //req.user = userValue; //return req.user to next level
      let user = await UserModel.findOne({ _id: userTokenValues.user_id }); //get type from _id (get all the user)
      console.log('id', userTokenValues.user_id);
      console.log('userTokenValues', userTokenValues);
      
      if(!user) return res.status(403).send("No user found for this token, No Access.");;
      req.user = user;
      console.log(userTokenValues);
      next();
    }
  );
};

