// only for global server
const areaRouter = require('./area.router');
const expertQuestionsRouter = require('./expertQuestions.router');
const expertQualifyRouter = require('./expertQualify.router');
const logRouter = require('./log.router');
const loginRouter = require('./login.router');
const playingTeamRouter = require('./playingTeam.router');
const questionRouter = require('./question.router');
const rateRouter = require('./rate.router');
const userRouter = require('./user.router');

module.exports = { 
    areaRouter
    , expertQuestionsRouter
    , expertQualifyRouter
    , logRouter
    , loginRouter
    , playingTeamRouter
    , questionRouter
    , rateRouter
    , userRouter
};