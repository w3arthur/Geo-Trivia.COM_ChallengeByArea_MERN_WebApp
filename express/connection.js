require('dotenv').config();
const mongoDBConnectionString = process.env.MONGO_DB_CONNECTION_STRING;
const mongoDBLoggingConnectionString = process.env.MONGO_DB_CONNECTION_LOGGING_STRING;

const mongoose = require("mongoose");

function makeNewConnection(uri) {
    const db = mongoose.createConnection(uri, {  useNewUrlParser: true, useUnifiedTopology: true, });
    db.on('error', function (error) { console.log(`MongoDB :: connection ${this.name} ${JSON.stringify(error)}`); db.close().catch(() => console.log(`MongoDB :: failed to close connection ${this.name}`)); });
    db.on('connected', function () { console.log(`MongoDB :: connected ${this.name}`); /* mongoose.set('debug', function (col, method, query, doc) { console.log(`MongoDB :: ${this.conn.name} ${col}.${method}(${JSON.stringify(query)},${JSON.stringify(doc)})`); });*/ });
    db.on('disconnected', function () { console.log(`MongoDB :: disconnected ${this.name}`); });
    return db;
}

const mongoose1 = makeNewConnection(mongoDBConnectionString);

const mongooseLogging = makeNewConnection(mongoDBLoggingConnectionString);

module.exports = {mongoose, mongoose1, mongooseLogging};