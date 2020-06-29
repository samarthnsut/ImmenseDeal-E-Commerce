const passport= require('passport')
const google = require('passport-google-oauth').OAuth2Strategy;
const crypto= require('crypto')
const Account = require('../modals/Account')
const env= require('./environment')

passport.use(new google({
   clientID: env.googleClientID,
   clientSecret: env.googleClientSecret,
   callbackURL: env.googleCallbackURL
},
 function(accessToken, refreshToken,profile,done){
     Account.findOne({e_mail : profile.emails[0].value}).exec(function(err,account){
         if(err){console.log('error in finding google user',err) ; return}

         console.log( 'prpfile::::::::::',profile)

         if(account)
         { 
             console.log('account fetched***********',account)
             return done(null, account)}

         else{
             console.log("creating account ***")
             Account.create({
                 name: profile.displayName,
                 e_mail: profile.emails[0].value,
                 u_name: profile.emails[0].value,
                 password: crypto.randomBytes(20).toString('hex')
             },function(err,account){
                if(err){console.log('error in finding google user',err) ; return}
                  console.log('account created &&&&&&&',account)     
                return done(null,account)
             })
         }

     })
 }

))

module.exports= passport;