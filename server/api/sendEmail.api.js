const nodemailer = require("nodemailer");

async function main() {

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
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: "w3arthur@gmail.com, legopart@gmail.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  
}

main().catch(console.error);