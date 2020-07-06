const passport=require('passport')
const LocalStategy= require('passport-local').Strategy
const Account= require('../modals/abc')

//console.log('inside passport local')
passport.use(new LocalStategy({
  usernameField: 'u_name',
  passwordField: 'password',
  passReqToCallback: true
},
function(req,u_name,password,done){
  // find user and establish identity
  //console.log('line 11 executing')
  Account.findOne({u_name: u_name},function(err,account){
     if(err){
         req.flash('err',err)
         return done(err)

     }
     // console.log('buyer found')
     if(!account || (account.password!=password)){
         req.flash('error','Invalid username/Password')
         return done(null,false)
     }
     // console.log('correct password')
     return done(null,account);
  })

}

));

//serialising user
passport.serializeUser(function(account,done){
   // console.log('serialising')
    done(null,account.id);
})


passport.deserializeUser(function(id,done){
  //  console.log('deserialising')
    Account.findById(id,function(err,account){
        if(err)
        {
            console.log('error in finding user')
            return done(err)
        }

        return done(null, account);
    })
})


passport.checkAuthentication=function(req,res,next){
    // if user is signed in
    if(req.isAuthenticated()){
        return next();
    }

    return res.redirect('/')
}

passport.setAuthenticatedAccount = function(req,res,next){
    if(req.isAuthenticated()){ 
      // console.log("isauthenticated...")
        res.locals.account = req.user;
    }

    next();
}

module.exports= passport;