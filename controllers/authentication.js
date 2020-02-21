const User = require('../models/User')
const jwt = require('jwt-simple');
const config = require('../config');

function tokenForUser(user){
    const timestamp = new Date().getTime();
    return jwt.encode({sub: user.id, iat: timestamp},config.secret)
}

exports.signup = function(req,res,next){
    console.log(req.body);
    const {email} = req.body;
    const {password} = req.body;


    if(!email || !password){
        return res.status(422).send({
            error: 'You must provide email/password'
        })
    }
    // See if a user with the given email exists
    User.findOne({email},function(err,existingUser){
        if(err){
            return next(err)
        }
         //if a user with email does exist, return an error
        if(existingUser){
            return res.status(422).send({error: 'Email is in use!'})
        }
        // If a user with email does nOT exist, create and save user record
        const user = new User({
            email: email,
            password: password
        })

        user.save(function(err){
            if(err){
                return next(err);
            }
            // Respoms to requesr indicating the useR WAS CREATED
            res.json({token: tokenForUser(user)});
        })
    })

   

    

    // Respond to request indicating the user was created



}

exports.signin = function(req,res,next){
    //User has already had thier email and password auth'd
    // We just need to give them a token
    res.send({token: tokenForUser(req.user)})
}