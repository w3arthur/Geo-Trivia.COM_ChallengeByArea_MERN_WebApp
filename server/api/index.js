//only for routers
const logEvent = require('./logEvent');
const sendEmail = require('./sendEmail');
const { ioTransmitter, receiver } = require('./socketio');
module.exports = { 
    logEvent, sendEmail
    , ioTransmitter, receiver
};