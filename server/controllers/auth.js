const {OAuth2Client} = require('google-auth-library')

const client = new OAuth2Client("602070662525-cg5up3456lcbdngu7nhji2j6inpi8t1b.apps.googleusercontent.com")

const User = require('../modules/user.module')

exports.googlelogin = (req, res) => {
    const {tokenId} = req .body;

    client.verifyIdToken({idToken: tokenId, audience: "602070662525-cg5up3456lcbdngu7nhji2j6inpi8t1b.apps.googleusercontent.com"}).then((response) => {
        const {email_verified, email} = response.payload;
        // if(email_verified) {
        //     User.findOne({email}).exec((err, user) => {
        //         if(err) {
        //             return res.status(400).json({
        //                 error: "Something went wrong..."
        //             })
        //         } else {
        //             if(user) {
        //                 const token = jwt.sign(
        //                     { userId: user.id},
        //                     'It is a big secret',
        //                     { expiresIn: '1h'}        
        //                 )
        //                 const {_id, email} = user;
        //                 res.json({ token, user: { _id, email}
        //                 })
        //             } else {
        //                 let password = email+process.env.JWT_SIGNIN_KEY;
        //                 let newUser = new User(email,password);
        //                 newUser.save((err, data) => {
        //                     if(err) {
        //                         return res.status(400).json({
        //                             error: "Something went wrong..."
        //                         })
        //                     }
        //                     const token = jwt.sign(
        //                         { _id: data._id},
        //                         'It is a big secret',
        //                         { expiresIn: '1h'}        
        //                     )
        //                     const {_id, email} = newUser;
        //                     res.json({ token, user: { _id, email}
        //                     })
        //                 })
        //             }
        //         }
            // }) 
        // }
    })    
    console.log()
}