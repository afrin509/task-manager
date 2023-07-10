// const sendgridAPIKey='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'
const sgMail=require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
// sgMail.send({
//     to:"dafrin148@gmail.com",
//     from:"dafrin148@gmail.com",
//     subject:"this is my first creation",
//     text:"I hope this one actually get to you"
// })

// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
// javascript
// const sgMail = require('@sendgrid/mail')
// sgMail.setApiKey('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')
// const msg = {
//   to: 'dafrin148@gmail.com', // Change to your recipient
//   from: 'dafrin148@gmail.com', // Change to your verified sender
//   subject: 'Sending with SendGrid is Fun',
//   text: 'and easy to do anywhere, even with Node.js',
//   html: '<strong>and easy to do anywhere, even with Node.js</strong>',
// }
// sgMail
//   .send(msg)
//   .then(() => {
//     console.log('Email sent')
//   })
//   .catch((error) => {
//     console.error("err",error)
//   })
const sendWelcomeEmail=(email,name)=>{
    sgMail.send({
        to:email,
        from:"dafrin148@gmail.com",
        subject:"thanks for joining in",
        text:'welcome to the app,'+name+'let me know how you get along with the app',
        
    })
}
const cancelEmail=(email,name)=>{
    sgMail.send({
        to:email,
        from:"dafrin148@gmail.com",
        subject:"cancellation email",
        text:'goodbye! hope to see you later',
        
    })
}
module.exports={
    sendWelcomeEmail,cancelEmail
}