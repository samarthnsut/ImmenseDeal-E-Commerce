const mongoose = require('mongoose')
const { modelName } = require('./abc')

const ratingSchema = new mongoose.Schema({
    account :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Account"
    },
    stars:{
        type : Number
    },
    israted :{
        type: Boolean
    },
    product :{
        type : mongoose.Schema.Types.ObjectId,
        ref :'Product'
    }
},{
    timestamps:true
})

const Rating= mongoose.model("Rating",ratingSchema);
module.exports= Rating;

