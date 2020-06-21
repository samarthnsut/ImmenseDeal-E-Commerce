const mongoose = require('mongoose');
const commentSchema= new mongoose.Schema({
    content:{
        type: String,
        required: true
    },
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account'
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }

},{
  timestamps: true
})

const Comment=mongoose.model('Comment',commentSchema);
module.exports=Comment;