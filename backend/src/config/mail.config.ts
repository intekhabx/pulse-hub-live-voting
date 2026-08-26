import nodemailer from "nodemailer";


// const transporter = nodemailer.createTransport({
//   service: "gmail", //here we use auto configured method without host, port etc..
//   auth: {
//     user: process.env.SMTP_EMAIL_USER,
//     pass: process.env.SMTP_EMAIL_PASS,
//   },
// });

const transporter = nodemailer.createTransport({
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
});


// optional: adding listener
transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP connection failed:", error);
  } else {
    console.log("SMTP server is ready to send emails");
  }
});


export default transporter;
