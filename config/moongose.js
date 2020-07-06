const mongoose = require('mongoose');
const env= require('./environment')
mongoose.connect(env.db,{ useNewUrlParser: true });

var db = mongoose.connection;

db.on('error',console.error.bind("error in connecting to db"));

db.once('open',function(){
    console.log("database connection successful");
})

