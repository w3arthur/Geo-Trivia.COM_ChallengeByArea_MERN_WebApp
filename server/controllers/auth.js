const fetch = require("node-fetch");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");

const client = new OAuth2Client(
  "602070662525-cg5up3456lcbdngu7nhji2j6inpi8t1b.apps.googleusercontent.com"
);

const User = require("../modules/user.module");

// google login
exports.googlelogin = (req, res) => {
  const { tokenId } = req.body;

  client
    .verifyIdToken({
      idToken: tokenId,
      audience:
        "602070662525-cg5up3456lcbdngu7nhji2j6inpi8t1b.apps.googleusercontent.com",
    })
    .then (async(response) => {
      const { email_verified, email } = response.payload;
      console.log({email})
      const googleUser = await User.findOne({ email });    

      // console.log(googleUser);
      if (!email_verified) {
        return res.status(400).json({
          error: "Something went wrong...",
        });
      } else {
        const token = jwt.sign({ userId: googleUser.id }, "It is a big secret", {
          expiresIn: "1h",
        });
        if (!googleUser) {
          let password = email + "222";
          let newUser = new User({ email, password });
          newUser.save();
          
        } else {
          res.json({ token, userId: googleUser.id });
          console.log("User has login!");
        }
        
      }
    });
};

// facebook login
exports.facebooklogin = (req, res) => {
  const { userID, accessToken } = req.body;

  let grurl = `https://graph.facebook.com/v2.11/${userID}/?fields=id,email&access_token=${accessToken}`;
  fetch(grurl, {
    method: "GET",
  })
    .then((res) => res.json())
    .then(async(res) => {
      
      const { email } = res;
      console.log({email});

      const facebookUser = await User.findOne({ email });
      // console.log(facebookUser);
      const token = jwt.sign({ 
            userId: facebookUser.id }, 
            "It is a big secret", 
            {expiresIn: "1h"})

      if(!facebookUser){
        let password = email + "333";
        let newUser = new User({email, password});
        newUser.save()
      } else {
        res.json({ token, userId: facebookUser.id });         
        console.log("User has login!");
      }      
    });
};
