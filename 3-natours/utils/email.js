const nodemailer = require('nodemailer');

const sendEmail = options => {
  // create a transporter
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    // activate in gmail 'less secure app' option
    
  });
  // define the email options

  // send email with nodemailer
};
