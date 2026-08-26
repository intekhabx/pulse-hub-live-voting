import dns from "node:dns";
import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";

// Fixes ETIMEDOUT on hosts (like Render) whose default DNS resolution
// prefers IPv6, which Gmail's SMTP server often doesn't respond well to.
// Node 18+ only. Must run before any SMTP connection is created.
dns.setDefaultResultOrder("ipv4first");


// const transporter = nodemailer.createTransport({
//   service: "gmail", //here we use auto configured method without host, port etc..
//   auth: {
//     user: process.env.SMTP_EMAIL_USER,
//     pass: process.env.SMTP_EMAIL_PASS,
//   },
// });

const transportOptions: SMTPTransport.Options = {
  host: "smtp.gmail.com",
  port: 587,
  secure: false,

  auth: {
    user: process.env.SMTP_EMAIL_USER,
    pass: process.env.SMTP_EMAIL_PASS,
  },

  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
};

const transporter = nodemailer.createTransport(transportOptions);


// optional: adding listener
transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP connection failed:", error);
  } else {
    console.log("SMTP server is ready to send emails");
  }
});


export default transporter;
