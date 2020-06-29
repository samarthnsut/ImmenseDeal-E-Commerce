const express =require('express')
const cookieParser = require('cookie-parser')
const path = require('path')
const port=process.env.PORT||2000;
const db = require("./config/moongose");
const app=express();
const Account = require("./modals/Account")
const Product = require("./modals/products")
const Comment = require("./modals/comment")
const Rating= require("./modals/ratings")
const Chatbox= require('./modals/chatbox')
const Message= require('./modals/messages')
const session = require('express-session')
const passport=require('passport')
const passportLocal = require('./config/passport-local-stategy')
const flash=require('connect-flash');
const mwares=require('./config/middleware');
const passportGoogle= require('./config/google-oauth-stategy')
const { checkAuthentication } = require('./config/passport-local-stategy');
const { profile } = require('console');
const  commentMailer = require('./mailers/commentMail')
const addproduct= require('./mailers/addProduct')
const paypal = require('paypal-rest-sdk')
const env = require('./config/environment')

//setting up chat server
const chatServer = require('http').Server(app)
const chatSocket = require('./config/chat_socket').chatSocket(chatServer)
chatServer.listen(3000)
console.log("chat socket is listening at port 3000")

app.use(session({
    name: 'Buy-Sell Portal',
    secret: env.cookie,
    saveUninitialized: false,
    resave: false,
    cookie:{
        maxAge: (100*60000*60000)
    }
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(passport.setAuthenticatedAccount);

app.set("view engine",'ejs')
app.set('views',path.join(__dirname, 'views'))
app.use(express.urlencoded())
app.use(cookieParser());
app.use(express.static("assests"))
app.use('/uploads', express.static(__dirname + '/uploads'))

app.use(flash());
app.use(mwares.setflash);

app.listen(port,function(err){
    if(err)
    console.log("error")

    console.log("server running")
})

//rendering INDEX
app.get("/", function(req,res){

    return res.render('index')
})
//rendering Add PRODUCT
app.get("/addproduct", function(req,res){

    return res.render('addproduct')
})

// RENDERING HOME PAGE ....... USING POPULATE ETC
app.get("/home",passport.checkAuthentication,function(req,res){
  
 
    Product.find({})
    .populate('account')
    .populate({
        path: 'comment',
        populate: {
            path: 'account'
        }
    })
    .exec(function(err,product){
     
        if(err){
            console.log("eror in finding user products",err)
        }
      //  console.log(product);
      
       return res.render('home', {
        
           product: product,


    })
 })

  
})

// Rendering SIGN IN
app.get("/signin",function(req,res){
    return res.render("index")
})
// Rendering MainTain
app.get('/maintain', function(req,res){
    return res.render('maintain')
})
// Rendering SIGN UP
app.get("/signup",function(req,res){
    return res.render("signup")
})
// Renderng profile/ accinfo
app.get("/accinfo",passport.checkAuthentication,function(req,res){
    
    //  console.log("req account ",res.locals.account)
    //req.flash('success','logged in successfully')
              return res.render("accinfo")
          })
      
// Rendering Update Form
app.get("/updateprofile",passport.checkAuthentication,function(req,res){
   
   var account= res.locals.account
    return res.render("updateForm",{
      account:account
    })
})

// RENDERING UPDATE PASSWORD PAGE 
app.get("/change-password",passport.checkAuthentication,function(req,res){
   
    var account= res.locals.account
     return res.render("changepassword",{
       account:account
     })
 })
//CREATING A NEW ACCOUNT
app.post("/new-account",function(req,res){
    
    if(req.body.password!=req.body.confirm_password){
        console.log(req.body.password)
        console.log(req.body.Password)
        console.log('password do not match')
        //req.flash('error','password do not match')
        return res.redirect('back')
    }

    Account.findOne({u_name: req.body.u_name},function(err,account){
        if(err){
            console.log('error in finding user')
            return;
        }
        if(!account){
            Account.create(req.body,function(err,account){
                if(err){
                    console.log('error in creating user',err)
                      return;
                }

                return res.redirect('/')
            })
        }else{
            console.log('user already exist')
           // req.flash('error','user already exist')
            return res.redirect('back')
        }
        
    })
   
})

// CReating Express SESSION
app.post('/create-session',passport.authenticate(
    'local',
    {failureRedirect: '/'}
  ),function(req,res){

    req.flash('success','logged in successfully')
    res.redirect('/accinfo')
})

// GOOGLE SIGN IN/SIGNUP
app.get('/auth/google',passport.authenticate('google', {scope: ['profile', 'email']}));
app.get('/auth/google/callback',passport.authenticate('google',{failureRedirect: '/signin'}),
function(req,res){
    req.flash('success','logged in successfully')
    res.redirect('/accinfo')
})

//UPDATE PROFILE 
app.post('/updateprofile/:id',checkAuthentication,function(req,res){
    if(req.user.id== req.params.id)
    {
          Account.findByIdAndUpdate(req.params.id, req.body,function(err,user){
              if(err){console.log("error in updatng",err)}
              req.flash('success', 'Profile Updated')
              return res.redirect('/accinfo')
          })
    }
    else{
        req.flash('error','unautorized')
        return res.redirect('back')
    }
})

// CHANGING PASSWORD
app.post('/change-password/:id',checkAuthentication,function(req,res){

    Account.findById(req.params.id,function(err,account){
        if(err)
        {
            req.flash('error','cannot find account');
            console.log("error in change password ",err)
            return;
        }
        if(String(account.password)===String(req.body.c_password))
        {
           if(String(req.body.password)===String(req.body.confirm_password))
           {
                account.password=req.body.password;
                account.save();
                req.flash('success','password changed successfully')
                return res.redirect('/home')
           }
           else{
               req.flash('error','password do not match')
               return res.redirect('back')
           }
        }
        else{
            req.flash('error','current password is incorrect')
             return res.redirect('back')
        }
    })
})

//SIGN OUT
app.get('/sign-out',function(req,res){
    req.logOut()
    req.flash('success','logged out successfully')
    return res.redirect('/signin')
})
// PRODUCT ROUTES
// CREATING PRODUCT
app.post('/createproduct',function(req,res){
    console.log("i=outer ",req.body)
    Product.uploadedAvatar(req,res,function(err){
        console.log("inner",req.body)
        console.log("file",req.file)
        Product.create({
            pname: req.body.pname,
            price: req.body.price,
            description: req.body.description,
            account: req.user._id
        },function(err,product){
            if(err)
            {
                console.log("error in creating product",err);
                return res.redirect("back");
            }
            
            console.log("product",product)
            if(req.file)
            {
                console.log("file",req.file)
                product.avatar= Product.avatarPath+'/'+req.file.filename
                product.save();
            }
          product.populate('account').execPopulate(function(err,product){
              if(err){console.log("error in population",err)}
            console.log('populated account',product)
            addproduct.newProduct(product)
          })
          
        })

    })
    
    req.flash('success','product added successfully')
    return res.redirect("home");
})

//Delete PRODUCT
app.get('/delete-product/:id',checkAuthentication,function(req,res){
  
    Product.findById(req.params.id,function(err,product){
        if(err)
        {
            console.log("error",err)
            req.flash('error','cannot delete product')
        }
        if(product.account==req.user.id)
        {
            product.remove();

            Comment.deleteMany({product:req.params.id},function(err){
                if(err)
                {
                    req.flash('error','cannot delete product')
                    return res.redirect('home')

                }
               req.flash('success','product deleted')
                return res.redirect('/home')

            })
        }

    })


})


// RENDERING PRODUCT TEMPLATE

app.get('/template/:id',checkAuthentication,function(req,res){

    Product.findById(req.params.id)
    .populate('account')
    .populate({
        path: 'comment',
        populate: {
            path: 'account'
        }
    })
    .populate('ratings')
    .populate({
        path: 'chatbuyer',
        populate: {
            path : 'buyer'
        }
    })
    .exec(function(err,product){
        if(err){console.log("error in rendering product",err)}
         Account.findById(req.user._id)
         .populate('chatting')
         .exec(function(err,account){
            return res.render('product-template',{
                product:product,
                acc:account
            })
         })


           
     })
       
 })

//CART ROUTES
//ADDING ITEM TO CART
app.get('/addtocart/:id',passport.checkAuthentication,function(req,res){
    //console.log("params :" , req.params.id )
    let curraccount= res.locals.account;
   Product.findById(req.params.id,function(err,product){
     //  console.log("product to be added in cart",product)
      // console.log("req account ",res.locals.account)
       let temp=false;

       for(p of curraccount.cart)
       {
          // console.log("inside for loop",p)
           if(String(p._id)===String(product._id))
           {
              // console.log("inside if")
               temp=true;
           }
       }
       if(temp===false)
       {
        curraccount.cart.push(product);
        curraccount.save();
        req.flash('success','item added to cart')
        return res.redirect('/cart');
       }
      req.flash('error','item already present in cart')

       return res.redirect('/cart');

      
   })
})

// RENDERING CART
app.get("/cart",passport.checkAuthentication,function(req,res){
  
    Account.findById(res.locals.account._id)
    .populate({
        path : 'cart',
        populate :[{
            path: 'product',
            model : 'Product',
            
        },{
            path: 'account',
            model: 'Account'
        }]
    })
    .exec(function(err,acc){
        if(err){
            console.log("eror in finding user cart",err)
        }
      //  console.log(product);
       return res.render('cart', {
        
           account: acc


      })
  })
})

//Remove from Cart
app.get("/remove-cart/:id",passport.checkAuthentication,function(req,res){
     
    console.log("cart size :" , res.locals.account.cart.length)
    for(var i=0;i<res.locals.account.cart.length;i++)
    {
        
        console.log("inside for", res.locals.account.cart[i])
        console.log("params id :" , req.params.id)
        if(String(req.params.id)===String(res.locals.account.cart[i]))
        {
            console.log("inside ifff")
            res.locals.account.cart.splice(i,1);
        }
        res.locals.account.save()
    }
    req.flash('success','item removed from cart')
    console.log("cart size : after" , res.locals.account.cart.length)
    return res.redirect('/cart')
})

//Comment/review Routes
//ADD A COMMENT
app.post('/comment',checkAuthentication, async function(req,res){

    try{
   let product = await Product.findById(req.body.product)
    
     if(product)
     {    //console.log("found product", product);
         let comment=await Comment.create({
             content: req.body.content,
             product: req.body.product,
             account: req.user._id
         })
        
        
           console.log("the comment is" , comment);
            product.comment.push(comment)
             product.save();

            comment = await comment.populate('account').execPopulate();
            console.log("populated comment",comment)
            commentMailer.newComment(comment)

            req.flash('success','comment added successfully')
            return res.redirect("back");
         
     }else{
     console.log("no product found");}
    }catch(err){
        console.log("error in creating comment",err)
    }

    


})

// DELETE a comment
app.get('/delete-comment/:id',checkAuthentication,function(req,res){
  Comment.findById(req.params.id,function(err,comment){
   
   
      if(comment.account == req.user.id)
      {
          console.log("comment ",comment)

          let postid= comment.product
          comment.remove()
          Product.findByIdAndUpdate(postid,{$pull: {comment: req.params.id}},function(err,post){
              req.flash('success','comment deleted')
              return res.redirect('back')
          })

      }
  })  
})

//RATINGS/ LIKES
app.get('/addrating/:id/:num',checkAuthentication,function(req,res){
    console.log("inside create rating",req.params.num)

  Rating.create({
      account: req.user._id,
      stars : req.params.num,
      israted: true,
      product: req.params.id
  },function(err,rate){

    console.log("rating details", rate)
       Product.findById(req.params.id,function(err,product){
           console.log("rate",rate)
           product.ratings.push(rate);
          // product.save();
           switch(req.params.num)
           {
               case '1' : product.count1= product.count1+1;
                         //product.save();
                         break;
               case '2'  : product.count2=product.count2+1;
                          // product.save();
                         break;
               case '3'  : product.count3=product.count3+1;
                          // product.save();
                         break;
               case '4'  : product.count4=product.count4+1;
                            // product.save();
                         break;
               case '5'  : product.count5=product.count5+1;
                           // product.save();
                         break;
           }
         product.total=product.total+1;
        // product.save();
          var val= (product.count1+product.count2*2+product.count3*3+product.count4*4+product.count5*5)/product.total;
          product.ratevalue=val;
         product.save();

         
       })
    
  })

    return res.redirect('back')
})
//CHATBOX ROUTES
//Creacting Chatbox
app.get('/create-chatbox/:id',checkAuthentication,function(req,res){
    let chatboxID= res.locals.account._id+req.params.id
    Chatbox.findOne({name: chatboxID},function(err,chatbox){
        if(err)
        {console.log("error in finding chatbox", err); return;}
        console.log("inside find",chatbox)

        if(chatbox){
         console.log("inside if",chatbox)
        }else{
            console.log("inside else ")
            Chatbox.create({
                name: chatboxID,
                buyer:req.user._id,            
                item:req.params.id
            },function(err,chatbox){
             if(err){console.log("error in creating chatbox", err); return;}
              
             Account.findById(req.user._id,function(err,account){
                if(err){console.log("error in creating chatbox", err); return;}

                account.chatting.push(chatbox);
                account.save()
             })
             Product.findById(req.params.id,function(err,product){
                if(err){console.log("error in creating chatbox", err); return;}
                    product.chatbuyer.push(chatbox)
                    product.save();
                Account.findById(product.account._id,function(err,account){
                    if(err){console.log("error in creating chatbox", err); return;}
    
                    account.chatting.push(chatbox);
                    account.save()
                 })
               
             })
             console.log("this is the created chat box",chatbox)
           
            })    
        }
         return res.redirect('back')
    })
})
//Creating Message
app.post('/createmsg/:id',checkAuthentication,function(req,res){
   Message.create({
         msgcontent: req.body.msgcontent,
         fromUser: req.user._id
   },function(err,message){
    if(err){console.log('error in creating msg',err); return;}
       

       console.log("req.params.id",req.params.id)
      Chatbox.findById(req.params.id,function(err,chatbox){
         if(err){console.log('error in finding msg',err); return;}

        chatbox.messagelist.push(message);
        chatbox.save()
        console.log("message created and added to chat box",message);

        if(req.xhr)
        {
            console.log("inside xhr");
           (res.status(200).json({
              data:{
                msg: message,
              },
            mess:'message created'                
            }))
            return;
        }
        console.log("leaving xhr")
      })
   })

  
})
//Closing A chat box
app.get('/close-chat-box',function(req,res){
    return res.redirect('back')
})
//Deleting A chatbox
app.get('/delete-chat-box/:id', async function(req,res){

    let ChatBox = await Chatbox.findById(req.params.id);
      
       let buyer = ChatBox.buyer
       let seller = ChatBox.seller
       let product = ChatBox.item
       ChatBox.remove();

       let acc=await  Account.findByIdAndUpdate(buyer,{$pull: {chattting: req.params.id}})
       let ac= await Account.findByIdAndUpdate(seller,{$pull: {chattting: req.params.id}})
       let p= await Product.findByIdAndUpdate(product,{$pull: {chatbuyer: req.params.id}})

       req.flash('success','chat box deleted')
       return res.redirect('back')   
})

//SEARCH PRODUCT
app.post('/search-products',function(req,res){
    Product.find({pname: {$regex: `${req.body.search}`}})
        .populate('account')
        .populate({
            path: 'comment',
            populate: {
                path: 'account'
            }
        })
        .exec(function(err,product){
            if(err){
                console.log("eror in finding user products",err)
            }      
           return res.render('home', {
            
               product: product,
        })
     })
    
    })


 paypal.configure({
        'mode' : 'sandbox',
        'client_id': env.paypalClientID,
        'client_secret' : env.paypalSecret
 })

 app.get('/pay',function(req,res){
    var create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://localhost/paymentsuccessful",
            "cancel_url": "http://paymentcancel"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "item",
                    "sku": "item",
                    "price": "1.00",
                    "currency": "INR",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "INR",
                "total": "1.00"
            },
            "description": "This is the payment description."
        }]
    };
    
    

    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            console.log("error in creating payment",error);
        } else {
            console.log("Create Payment Response");
            console.log(payment);
            for(let i=0;i<payment.links.length;i++){
                if(payment.links[i].rel=== 'approval_url'){
                    res.redirect (payment.links[i].href);
                }
            }
            
        }
    });
 })
app.get("/paymentsuccess",function(req,res){
    const payID =req.query.PayerID
    const paymentID=req.query.paymentId

    const execute = {
        "payer_id" :payID,
        "transactions" : [{
            "amount":"INR",
            "total" :"1.00"
        }]
    }

    paypal.payment.execute(paymentID,execute,function(err,payment){
        if(err){console.log("error in making payment",err);return;}

        console.log("get payment response")
        console.log(JSON.stringify(payment))
        res.send("payment successful")
    })
})

app.get('/paymentcancel',function(req,res){
   return res.send("payment Cancel")
})
    