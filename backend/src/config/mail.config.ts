import nodemailer from "nodemailer";


const transporter = nodemailer.createTransport({
  service: "gmail", //here we use auto configured method without host, port etc..
  auth: {
    user: process.env.SMTP_EMAIL_USER,
    pass: process.env.SMTP_EMAIL_PASS,
  },
});


export default transporter;
