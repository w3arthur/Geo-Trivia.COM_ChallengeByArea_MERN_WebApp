//only for routers
const devLog = require('./devLog');
const logEvent = require('./logEvent');
const sendEmail = require('./sendEmail');
const { ioTransmitter, receiver } = require('./socketio');
module.exports = { 
    devLog , logEvent, sendEmail
    , ioTransmitter, receiver
};