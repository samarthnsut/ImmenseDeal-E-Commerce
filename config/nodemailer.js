const nodemailer= require('nodemailer')
const ejs = require('ejs')
const path = require('path')

let transporter = nodemailer.createTransport({
    service : 'gmail',
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'immensedeal.ecommerce@gmail.com', // generated ethereal user
      pass: 'rplxmrfcyjrnkdav'                  // generated ethereal password
    },
  });

  let renderTemplate = (data, relativePath)=>{
      let mail;
      ejs.renderFile(
          path.join(__dirname,'../views/mailers',relativePath),
          data,
          function(err,template){
           if(err){console.log("error in rendering template",err); return;}
            mail=template;
          }  
      )

      return mail;
  }

  module.exports={
      transporter: transporter,
      renderTemplate: renderTemplate
  }