const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const validPassword = require('../lib/passwordUtils').validPassword;
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const fs = require('fs');
const path = require('path');
const pathToKey = path.join(__dirname, '..', 'pub_key.pem');
const User = require('../models/UserModel');

require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';
const PUB_KEY = isProduction ? process.env.PUB_KEY : fs.readFileSync(pathToKey, 'utf8');

/**
 * Passport authentication middleware
 * implementations of local strategy and jwt strategy below. 
 *
 * NOT CURRENTLY BEING USED, developed as a learning exercise
 *
 */

module.exports = async (app) => {

    // connect express app to passport 
    app.use(passport.initialize());

    // -- START LOCAL STRATEGY SECTION --

    // initialize session for local strategy
    app.use(passport.session());

    // field names from HTML form that passport should look for in JSON
    const fieldNames = {
        usernameField: 'email', 
        passwrdField: 'password'
    };

    // use local strategy for initial login 
    passport.use(new LocalStrategy(fieldNames, async (username, password, done) => {
        try {
            // find user in database, if one exists
            const user = await User.findByEmail(username);
            
            // if no user, tell passport to be done
            if(!user) return done(null, false);

            // validate user password 
            const isValid = validPassword(password, user.pw_hash, user.pw_salt);

            if (isValid) {
                return done(null, user);
            } else {
                return done(null, false);
            };
        } catch(err) {
            done(err);
        };
    }));

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

    // -- END LOCAL STRATEGY SECTION --



    // -- START JWT STRATEGY SECTION --

    // define options for how token is extracted and verified
    const options = {
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(), 
        secretOrKey: PUB_KEY, 
        algorithms: ['RS256']
    };

    // use JWT strategy for returning users 
    passport.use(new JWTStrategy(options, async (payload, done) => {
        try {

            // find user in database, if one exists 
            const user = await User.findById(payload.sub);

             // if there is a user, return user; else return false
            if(user) {
                return done(null, user);
            } else {
                return done(null, false);
            };
        } catch(err) {
            done(err);
        };
    }));

    // -- END JWT STRATEGY SECTION --

    return passport;
};