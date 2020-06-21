const nodemailer= require('../config/nodemailer')

exports.newComment = (comment)=>{
    console.log("inside comment mailer",comment)
    let htmls = nodemailer.renderTemplate({comment:comment},'/commentmailer.ejs')
    nodemailer.transporter.sendMail({
        from : 'immensedeal.ecommerce@gmail.com',
        to : comment.account.e_mail,
        subject : 'New Comment Published',
        html : htmls
    },(err,info)=>{
        if(err){console.log("error in sending mail",err); return;}

        console.log('mail is sent here is info:', info)
        return;
    })
}
