const AreaModel = require('./area.module');
const ExpertModel = require('./expert.module');
const FlowerModel = require('./flower.module');
const GameTeamModel = require('./gameTeam.module');
const InvitationModel = require('./invitation.module');
const {LoggingModel, ErrorModel} = require('./log.module');
const UserModel = require('./user.module');

module.exports = {
    AreaModel, ExpertModel, FlowerModel, GameTeamModel, InvitationModel, LoggingModel, ErrorModel, UserModel
};