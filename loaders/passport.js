const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('../db');
const validPassword = require('../utils/passwordUtils').validPassword;
const UserModel = require('../models/UserModel');
const User = new UserModel();

module.exports = async (app) => {
    
    // connect express app to passport 
    app.use(passport.initialize());
    app.use(passport.session());

    // field names from HTML form that passport should look for in JSON
    const fieldNames = {
        usernameField: 'email', 
        passwrdField: 'password'
    };

    // callback used by passport to verify user
    const verifyCallback = async (username, password, done) => {
        try {
            const user = await User.findByEmail(username);
            
            // if no user, tell passport to be done
            if(!user) {
                return done(null, false);
            }

            // validate user password 
            // TODO- - IMPLEMENT FNCTN
            const isValid = validPassword(password, user.pw_hash, user.pw_salt);

            if (isValid) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        } catch(err) {
            done(err);
        };
    };
    
    // use local strategy
    passport.use(new LocalStrategy(fieldNames, verifyCallback));

    // put user id into the session
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    // take user id out of the session 
    passport.deserializeUser(async (userId, done) => {
        try {
            const user = await User.findById(userId);
            done(null, user);
        } catch(err) {
            done(err);
        }
    });

    return passport;
};