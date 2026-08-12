interface OtpTemplateParams {
  otp: string;
  expiresInMinutes?: number;
}

export const otpEmailTemplate = ({otp, expiresInMinutes = 15}: OtpTemplateParams) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Verify your email</title>
      </head>

      <body
        style="
          margin: 0;
          padding: 0;
          background-color: #0f0f17;
          font-family: Arial, sans-serif;
        "
      >
        <div
          style="
            max-width: 500px;
            margin: 40px auto;
            padding: 32px;
            background-color: #171725;
            border-radius: 16px;
            color: #ffffff;
          "
        >
          <h1 style="margin: 0 0 12px;">
            Verify your email
          </h1>

          <p style="color: #a1a1aa;">
            Thanks for creating your Pulse Hub account.
            Use the OTP below to verify your email address.
          </p>

          <div
            style="
              margin: 30px 0;
              padding: 20px;
              background-color: #222235;
              border-radius: 12px;
              text-align: center;
            "
          >
            <span
              style="
                font-size: 32px;
                font-weight: bold;
                letter-spacing: 8px;
                color: #a78bfa;
              "
            >
              ${otp}
            </span>
          </div>

          <p style="color: #a1a1aa;">
            This OTP will expire in ${expiresInMinutes} minutes.
          </p>

          <p
            style="
              margin-top: 30px;
              font-size: 12px;
              color: #71717a;
            "
          >
            If you didn't create this account, you can safely ignore
            this email.
          </p>
        </div>
      </body>
    </html>
  `;
};
