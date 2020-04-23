const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Eduardo Marcos <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async send(template, subject) {
    // sending the acctual email
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        firstName: this.firstName,
        url: this.url,
        subject
      }
    );

    // define the email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html)
    };

    // create a transport and send the email

    await this.newTransport().sendMail(mailOptions);
  }

  async sendResetPassword() {
    await this.send(
      'passwordReset',
      'Reset your password! (the token is valid for 10 minutes)'
    );
  }

  async sendVerify() {
    await this.send(
      'AccountVerification',
      'Please verify your account before have fun with us :)!'
    );
  }

  async sendWelcome() {
    await this.send(
      'welcome',
      'Welcome to surfDiary. Made from surfers to surfers :)'
    );
  }

  async sendGoodbye() {
    await this.send(
      'goodBye',
      'Thank you for has joined us :). If you miss us, login again :)'
    );
  }
};
