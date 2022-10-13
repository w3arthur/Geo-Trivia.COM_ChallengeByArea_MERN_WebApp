const allowedAccess = require('./allowedAccess');
const auth = require('./auth');
const database = require('./database');
const email = require('./email');
const language = require('./language');
const ports = require('./ports');
const questions = require('./questions');
const tokens = require('./tokens');
const user = require('./user');

module.exports = {
    allowedAccess
    , auth
    , database
    , email
    , language
    , ports
    , questions
    , tokens
    , user
};