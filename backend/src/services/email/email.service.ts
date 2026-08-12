import resend from "../../config/resend.config";
import { otpEmailTemplate } from "./templates/otp.template";


interface SendOtpOnEmailParams {
  email: string;
  otp: string;
}

export const sendOtpOnEmail = async ({email, otp}: SendOtpOnEmailParams) => {

  const { data, error } = await resend.emails.send({
    from: `Pulse Hub <${process.env.RESEND_FROM_EMAIL}>` || "pulsehub@board.com",
    to: [email],
    subject: "Verify your Pulse Hub account",
    html: otpEmailTemplate({otp, expiresInMinutes: 15}),
  });

  if (error) {
    console.error("Failed to send OTP email:", error);
    throw new Error("Failed to send OTP email");
  }

  // return data;
  return;
};
