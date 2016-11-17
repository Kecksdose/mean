var LocalStrategy   = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');
//temporary data store
var mongoose = require('mongoose');

var User = mongoose.model('User');
var Post = mongoose.model('Post');

module.exports = function(passport){

    // Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function(user, done) {
        console.log('serializing user:', user._id);
        //return the unique id for the user
        return done(null, user._id);
    });


    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            console.log('deserializing user:',user.username);
            done(err, user);
        });
    });

    passport.use('login', new LocalStrategy({
            passReqToCallback : true
        },
        function(req, username, password, done) {
            console.log('login process for username ' + username + ' ...');
            User.findOne({username: username}, function(err, user) {
                if(err){
                    console.log('error in db');
                    return done(err, false);
                }

                // if there is no user with this username
                if(!user) {
                    console.log('no user found');
                    return done('user ' + username + 'not found.', false);
                }

                if(!isValidPassword(user, password)){
                    // wrong password
                    console.log('wrong password');
                    return done('incorrect password', false);
                }
                console.log('login sucessfully!');
                return done(null, user);
            });
        }
    ));

    passport.use('signup', new LocalStrategy({
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {
            console.log('signup process for username ' + username + ' ...');
            User.findOne({username: username}, function(err, user){
                if(err){
                    console.log('error in db');
                    return done(err, false);
                }

                if(user){
                    // we have already signed this user up
                    console.log('username already taken');
                    return done('username already taken', false);
                }

                var user = new User();
                user.username = username;
                user.password = createHash(password)
                user.save(function(err, user){
                    if(err){
                        return done(err, false);
                    }
                    console.log('sucessfully signed up user ' + username);
                    return done(null, user);
                });
            });
        })
    );

    var isValidPassword = function(user, password){
        return bCrypt.compareSync(password, user.password);
    };
    // Generates hash using bCrypt
    var createHash = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    };

};
