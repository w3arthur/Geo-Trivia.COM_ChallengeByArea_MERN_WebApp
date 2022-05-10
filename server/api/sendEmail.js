require("dotenv").config();
let emailAddressReferLink = process.env.EMAIL_REFER_TO;
if (process.env.NODE_ENV !== 'production'){ 
  emailAddressReferLink = process.env.EMAIL_REFER_TO_DEV;
}

const nodemailer = require("nodemailer");

async function sendEmail( toEmail, teamId ) {

  let testAccount = await nodemailer.createTestAccount();
  let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'geo.trivia.team@gmail.com', // generated ethereal user
        pass: 'a123a456', // generated ethereal password
      },
    });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Geo Trivia Team" <geo.trivia.team@gmail.com>' // sender address
    , to: toEmail //toEmail, // list of receivers
    , subject: `Game Invitation ✔ ${teamId}` // Subject line
    , text: `Start Playing: ${emailAddressReferLink}${teamId}` // plain text body
    , html: `<b>Start Playing: <a href="${emailAddressReferLink}${teamId}">Trivia Game ${teamId}</a></b>` // html body
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  
}

module.exports = sendEmail;