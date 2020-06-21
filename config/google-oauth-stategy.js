const passport= require('passport')
const google = require('passport-google-oauth').OAuth2Strategy;
const crypto= require('crypto')
const Account = require('../modals/Account')

passport.use(new google({
   clientID: "128517218813-00kh225uaklf403i7pjnqgr5m3qhgfhi.apps.googleusercontent.com",
   clientSecret: "xdmfwxzKzD1u6HJL0-x-zfI3",
   callbackURL: "http://localhost:2000/auth/google/callback"
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