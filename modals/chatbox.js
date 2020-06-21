const mongoose = require('mongoose');

const chatboxSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    buyer:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required:true
    },
    seller:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Account',
    
    },
    item : {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required:true
    },
    messagelist:[{
        type: mongoose.Schema.Types.ObjectId,
        ref : 'Messages'
    }]
})

const Chatbox=mongoose.model('Chatbox',chatboxSchema,'chatbox');
module.exports=Chatbox;
