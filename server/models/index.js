//only for routers
const AreaModel = require('./area.model');
const ExpertModel = require('./expert.model');
const PlayingTeamModel = require('./playingTeam.model');
const {LoggingModel, ErrorModel} = require('./log.model');
const QuestionModel = require('./question.model');
const UserModel = require('./user.model');

module.exports = {
    AreaModel, ExpertModel, PlayingTeamModel, LoggingModel, ErrorModel, QuestionModel, UserModel
};