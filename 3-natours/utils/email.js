/* eslint-disable import/no-extraneous-dependencies */
const nodemailer = require('nodemailer');

// new Email(user, url).sendWelcome();
module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstNmae = user.name.split(' ')[0];
    this.url = url;
    this.from = `John Doe <${process.env.EMAIL_FROM}>`;
  }

  createTransport() {
    if (process.env.NODE_ENV === 'production') {
      // 
      return 1;
    }

    return nodemailer.createTransport({
      // service: 'Gmail',
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // send the actual email
  send(template, subject) {
    // render html based on a pug template
    
    // define email options
    const mailOptions = {
      from: 'John Doe <hello@john.io>',
      to: options.email,
      subject: options.subject,
      text: options.message,
      // html:
    };

    // create a transport and send email
  }

  sendWelcome() {
    this.send(`Welcome`, 'Welcome to the NAtours Family!');
  }
};

const sendEmail = async (options) => {
  // create a transporter
  // const transporter = nodemailer.createTransport({
  //   // service: 'Gmail',
  //   host: process.env.EMAIL_HOST,
  //   port: process.env.EMAIL_PORT,
  //   secure: false,
  //   auth: {
  //     user: process.env.EMAIL_USERNAME,
  //     pass: process.env.EMAIL_PASSWORD,
  //   },

  //   // activate in gmail 'less secure app' option
  // });
  // define the email options
  // const mailOptions = {
  //   from: 'John Doe <hello@mails.io>',
  //   to: options.email,
  //   subject: options.subject,
  //   text: options.message,
  //   // html:
  // };

  // send email with nodemailer
  await transporter.sendMail(mailOptions);
};

// module.exports = sendEmail;
