// var passport = require('passport');
var User = require('../models/user.model');
var config = require('./auth.config');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var LocalStrategy = require('passport-local').Strategy;

module.exports = function (passport) {

    var localOptions = {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    };

    var localLogin = new LocalStrategy(localOptions, function (req,email, password, done) {

        User.findOne({
            email: email
        }, function (err, user) {

            if (err) {
                return done(err);
            }

            if (!user) {
                
                return done(null, false, req.flash('message', 'User Not found.'));
            }

            user.comparePassword(password, function (err, isMatch) {

                if (err) {
                    return done(err);
                }

                if (!isMatch) {
                    return done(null, false, req.flash('message', 'Invalid Password'));
                }

                return done(null, user);

            });

        });

    });

    // var opts = {};
    // opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    // opts.secretOrKey = config.secret;
    // passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    //     console.log(jwt_payload._id);
    //     User.findOne({_id: jwt_payload._id}, function(err, user) {
    //         if (err) {
    //             return done(err, false);
    //         }
    //         if (user) {
    //             done(null, user);
    //         } else {
    //             done(null, false);
    //             // or you could create a new account
    //         }
    //     });
    // }));
    passport.serializeUser(function (user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    var jwtOptions = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.secret
    };

    var jwtLogin = new JwtStrategy(jwtOptions, function (payload, done) {
        console.log(payload._id);

        User.findById(payload._id, function (err, user) {

            if (err) {
                return done(err, false);
            }

            if (user) {
                done(null, user);
            } else {
                done(null, false);
            }

        });

    });

    // passport.use(jwtLogin);
    passport.use('local-login',localLogin);
}
