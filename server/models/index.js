//only for routers
const AreaModel = require('./area.model');
const ConfigModel = require('./config.model');
const ExpertQualifyModel = require('./expertQualify.model');
const PlayingTeamModel = require('./playingTeam.model');
const {LoggingModel, ErrorModel} = require('./log.model');
const QuestionModel = require('./question.model');
const {UserModel, UserFacebookModel, UserGoogleModel} = require('./user.model');
// ADD logs for WebSocket

module.exports = {
    AreaModel, ConfigModel, ExpertQualifyModel, PlayingTeamModel, LoggingModel, ErrorModel, QuestionModel, UserModel, UserFacebookModel, UserGoogleModel
};