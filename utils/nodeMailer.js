import { join } from "path";
import { config } from "dotenv";

import { renderFile } from "pug";
import { fromString } from "html-to-text";

config({ path: join(__dirname, "../config.env") });

import { createTransport } from "nodemailer";
import { th } from "date-fns/locale";

export class Email {
  constructor(user, url) {
    this.to = user.email;
    this.name = user.username;
    this.url = url;
    this.from = `ExploreDreamDiscover <${process.env.FROM_EMAIL}>`;
  }
  createTransport() {
    if (process.env.NODE_ENV === "production") {
      // sendGrid
      return createTransport({
        service: "SendGrid",
        auth: {
          user: process.env.SG_USERNAME,
          pass: process.env.SG_PASSWORD,
        },
      });
    }
    return createTransport({
      host: process.env.MAIL_TRAP_HOST,
      port: process.env.MAIL_TRAP_PORT,
      auth: {
        user: process.env.MAIL_TRAP_USER,
        pass: process.env.MAIL_TRAP_PASSWORD,
      },
    });
  }
  async send(template, subject) {
    // Render HTML Based On PUG.
    const html = renderFile(`${__dirname}/../views/emails/${template}.pug`, {
      name: this.name,
      url: this.url,
      subject,
    });

    // Mail Options

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: fromString(html),
    };
    // Transporter to send Email
    await this.createTransport().sendMail(mailOptions);
  }
  async sendWelcome() {
    await this.send("Welcome", "Welcome to Explore Dream Discover");
  }
  async sendPasswordReset() {
    await this.send("resetPassword", "Reset Password Valid For 10 MIN");
  }
  async sendFriendRequestAlert(from) {
    await this.send("friendRequest", `${from} has send You Friend request`);
  }
  async acceptedRequest(who) {
    await this.send("acceptRequest", `${who} has Accepted Your Request`);
  }
}
