require('dotenv').config();
const mongoDBConnectionString = process.env.MONGO_DB_CONNECTION_STRING;
const mongoose1 = require("mongoose");
mongoose1.connect( mongoDBConnectionString, { useNewUrlParser: true, useUnifiedTopology: true, } )
    .then( () => { console.log("connected to MongoDB\n") } )
    .catch( (err) => { console.log("could not connect to mongo\n", err) } );
module.exports = mongoose1;