const errorRouter = require('./logging.router/error.router');
const loggingRouter = require('./logging.router/logging.router');
const courseRouter = require('./course.router');
const flowerRouter = require('./flower.router');
const loginRouter = require('./login.router');
const userRouter = require('./user.router');
module.exports = { errorRouter, loggingRouter, courseRouter, flowerRouter, loginRouter, userRouter };