const loginRouter = require('./login');
const registerRouter = require('./register');
const userRouter = require('./user');
const passport = require('../loaders/passport');

module.exports = (app, passport) => {
    loginRouter(app, passport);
    registerRouter(app);
    
    // TO DELETE:
    app.use('/user', userRouter);
}