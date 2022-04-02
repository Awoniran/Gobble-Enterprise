const nodemailer = require('nodemailer');

function sendEmail(options){
const transport=nodemailer.createTransport()



const mailOptions={

}

await transport.sendMail(mailOptions)
}

module.exports=sendEmail

