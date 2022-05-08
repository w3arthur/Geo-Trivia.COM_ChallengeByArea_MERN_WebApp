const languageArray = ['english', 'hebrew', 'russian'];

const {mongoose, mongoose1, schemaVersion} = require("../connection");

const UserSchema =  new mongoose.Schema({
  schemaVersion: schemaVersion
  , name: { type: String, trim: true,  minlength: 4, maxlength: 50, index: true }
  , email: { require: true, type: String, trim: true, index: true  }
  , image: { type: String, trim: true, default: '' }
  , password: { type: String, trim: true}
  , role: { type: [Number], default: [1000], index: true }
  , age: { type: Number, require: true, index: true, min: 4, max: 120 }
  , language: { type: String, enum: languageArray, trim: true, default: 'english', index: true }
  , location: { type: { type: String , enum: ['Point'] , default: 'Point' } , coordinates: { type: [Number], default: [0, 0] } }
  , answeredQuestions: { type: Number, default: 0, index: true }
  , totalScore: { type: Number, default: 0, index: true }
  , expertAreas: { type: [Object], default: [], index: true }
  , facebook: { type: Boolean, default: false, index: true }
  , google: { type: Boolean, default: false, index: true }
  , passwordRegister: { type: Boolean, default: false, index: true }
}, { timestamps: true, })
UserSchema.index({location: '2dsphere'});


const UserModel = mongoose1.model(
  "User"  //users
  , UserSchema
);

const UserFacebookModel = mongoose1.model(
  "User"  //users_facebook_logins   //set facebook:true !
  , UserSchema
);

const UserGoogleModel = mongoose1.model(
  "User"  //users_google_logins   //set google:true !
  , UserSchema
);


module.exports = {UserModel, UserFacebookModel, UserGoogleModel};
