const mongoose = require('mongoose')

const accountSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type:String
    },
    l_name:{
        type: String
    },
    e_mail:{
        type: String,
        required : true
    },
    u_name:{
        type: String,
        required: true
    },
    password: {
        type: String,
        required : true
    },
    cart: [{
        type: mongoose.Schema.Types.ObjectId,
        ref : 'Product'
    }],
    chatting:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chatbox'
    }]
})

const Account = mongoose.model('Account',accountSchema)

module.exports= Account;