const mongoose= require("mongoose")
const multer = require("multer")
const path = require("path")
const AvatarPath = path.join('/uploads')

const productSchema= new mongoose.Schema({
    pname :{
        type : String,
        require : true
    },
    description:{
        type : String
    },
    price:{
       type: String,
       require: true
    },
    account :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Account"
    },
    comment:[{
        type: mongoose.Schema.Types.ObjectId,
        ref : "Comment"
    }],
    avatar :{
        type:String
    },
    ratings :[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Rating'
    }],
    count1 :{
        type: Number,
        default:0
    }, 
    count2 :{
        type: Number,
        default:0
    }, 
    count3 :{
        type: Number,
        default:0
    }, 
    count4 :{
        type: Number,
        default:0
    }, 
    count5 :{
        type: Number,
        default: 0
    },
    ratevalue:{
        type : Number,
        default: 0
    },
    total:{
        type:Number,
        default:0
    },
    chatbuyer:[{
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'Chatbox'
    }]
},{
    timestamps: true
})

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '..', AvatarPath))
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
  })

  productSchema.statics.uploadedAvatar = multer({storage:storage}).single('avatar')
  productSchema.statics.avatarPath = AvatarPath;


const Product= mongoose.model("Product",productSchema);
module.exports= Product;