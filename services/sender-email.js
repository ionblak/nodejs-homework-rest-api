const sendgridMail = require("@sendgrid/mail");
const config = require("../config");
require("dotenv").config();

class CreateSenderSendgrid {
  async send(message) {
    sendgridMail.setApiKey(process.env.SENDGRID_TOKEN);

    return await sendgridMail.send({ ...message, from: config.email.sendgrid });
  }
}

module.exports = CreateSenderSendgrid;
