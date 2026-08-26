import transporter from "../config/mail.config";
import { otpEmailTemplate } from "../templates/email-otp.template";


export const sendOtpOnEmail = async (otp: string, email: string) => {
  await transporter.sendMail({
    from: `"PulseHub" <${process.env.SMTP_EMAIL_USER}>`, // sender address
    to: email,
    subject: "Your PulseHub Verification OTP",
    html: otpEmailTemplate({otp, expiresInMinutes: 15})
  });
}
