const passport = require('passport');
const User = require('../models/User');
const config = require('../config');
const JWtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');


//create local Strategy
const localOptions = {usernameField: 'email'}
const localLogin = new LocalStrategy(localOptions,function(email,password,done){
    // Verify the username and password, call done with the user
    // if its correct username and password otherwise call done with false
    User.findOne({email:email},function(err,user){
        if(err){
            return done(err);
        }
        if(!user){
            return done(null,false);
        }
        //compare passwords - is password equal user.password?
        user.comparePassword(password,function(err,isMatch){
            if(err){
                return done(err);
            }
            if(!isMatch){
                return done(null,false);
            }
            return done(null,user);
        })

    })

})


//Setup options for JWT Strategy
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.secret
}

//create JWT Stategy
const jwtLogin = new JWtStrategy(jwtOptions,function(payload,done){
    // See if the user ID in the payload exists in our database
    // if it does , call 'done' with that user
    // otherwise call done with a user object
    User.findById(payload.sub,function(err,user){
        if(err){
            return done(err,false);
        }
        if(user){
            done(null,user);
        }else{
            done(null,false);
        }
    })
})

// Tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);