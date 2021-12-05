const homeRouter = require('./home');
const registerRouter = require('./register');
const loginRouter = require('./login');
const logoutRouter = require('./logout');
const accountRouter = require('./account');

module.exports = (app, passport) => {
    homeRouter(app);
    registerRouter(app);
    loginRouter(app, passport);
    logoutRouter(app, passport);
    accountRouter(app, passport);
}