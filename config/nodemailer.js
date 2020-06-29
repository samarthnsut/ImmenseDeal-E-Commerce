const nodemailer= require('nodemailer')
const ejs = require('ejs')
const path = require('path')
const env= require('./environment')
let transporter = nodemailer.createTransport(env.smtp);

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