const nodemailer= require('../config/nodemailer')

exports.newProduct = (product)=>{
    console.log("inside comment mailer",product)
    let htmls = nodemailer.renderTemplate({product:product},'/addproduct.ejs')
    nodemailer.transporter.sendMail({
        from : 'immensedeal.ecommerce@gmail.com',
        to : product.account.e_mail,
        subject : 'New Product  Added to store',
        html : htmls
    },(err,info)=>{
        if(err){console.log("error in sending mail",err); return;}

        console.log('mail is sent here is info:', info)
        return;
    })
}
