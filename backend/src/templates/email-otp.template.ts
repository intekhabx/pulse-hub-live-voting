type OtpTemplateParams = {
  otp: string;
  expiresInMinutes?: number;
};


const LOGO_URL = `${process.env.FRONTEND_BASE_URL}/logo.png`;

export const otpEmailTemplate = ({otp, expiresInMinutes = 15}: OtpTemplateParams) => {
  // Render OTP as individual digit boxes — table-based so it works
  // reliably across Gmail, Outlook, Apple Mail, etc.
  const otpDigits = otp
    .split("")
    .map(
      (digit) => `
        <td
          align="center"
          valign="middle"
          width="44"
          height="52"
          style="
            width: 44px;
            height: 52px;
            background-color: #1a1a27;
            border: 1px solid #322f47;
            border-radius: 10px;
            font-family: 'Courier New', Courier, monospace;
            font-size: 24px;
            font-weight: 700;
            color: #d8b4fe;
          "
        >
          ${digit}
        </td>
        <td width="8" style="width: 8px; font-size: 0; line-height: 0;">&nbsp;</td>`
    )
    .join("");

  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="color-scheme" content="dark" />
      <meta name="supported-color-schemes" content="dark" />
      <title>Verify your Pulse Hub account</title>

      <!--[if mso]>
        <style type="text/css">
          body, table, td { font-family: Arial, Helvetica, sans-serif !important; }
        </style>
      <![endif]-->
    </head>

    <body
      style="
        margin: 0;
        padding: 0;
        background-color: #08080d;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        color: #ffffff;
      "
    >
      <table
        role="presentation"
        width="100%"
        cellpadding="0"
        cellspacing="0"
        border="0"
        style="background-color: #08080d; margin: 0; padding: 0;"
      >
        <tr>
          <td align="center" style="padding: 48px 16px;">

            <!-- Main Card -->
            <table
              role="presentation"
              width="100%"
              cellpadding="0"
              cellspacing="0"
              border="0"
              style="
                max-width: 480px;
                background-color: #0f0f18;
                border: 1px solid #1f1f2c;
                border-radius: 20px;
              "
            >

              <!-- Logo / Brand -->
              <tr>
                <td align="center" style="padding: 40px 32px 24px;">
                  <img
                    src="${LOGO_URL}"
                    alt="Pulse Hub"
                    width="48"
                    height="48"
                    style="
                      display: block;
                      width: 48px;
                      height: 48px;
                      border-radius: 12px;
                      margin: 0 auto 14px;
                      border: 0;
                      outline: none;
                    "
                  />
                  <div
                    style="
                      font-size: 15px;
                      line-height: 20px;
                      font-weight: 600;
                      color: #71717a;
                      letter-spacing: 0.2px;
                    "
                  >
                    Pulse&nbsp;Hub
                  </div>
                </td>
              </tr>

              <!-- Divider -->
              <tr>
                <td style="padding: 0 32px;">
                  <div style="height: 1px; background-color: #1c1c28; font-size: 0; line-height: 0;">&nbsp;</div>
                </td>
              </tr>

              <!-- Content -->
              <tr>
                <td style="padding: 32px 32px 8px;">

                  <div
                    style="
                      font-size: 22px;
                      line-height: 28px;
                      font-weight: 700;
                      color: #ffffff;
                      text-align: center;
                      letter-spacing: -0.3px;
                    "
                  >
                    Verify your email
                  </div>

                  <div
                    style="
                      margin-top: 10px;
                      font-size: 14px;
                      line-height: 22px;
                      color: #8b8b98;
                      text-align: center;
                    "
                  >
                    Enter this code to confirm your email address and
                    finish setting up your account.
                  </div>

                  <!-- OTP Digit Boxes -->
                  <table
                    role="presentation"
                    cellpadding="0"
                    cellspacing="0"
                    border="0"
                    align="center"
                    style="margin: 32px auto 0;"
                  >
                    <tr>
                      ${otpDigits}
                    </tr>
                  </table>

                  <!-- Expiry -->
                  <div
                    style="
                      margin-top: 20px;
                      font-size: 13px;
                      line-height: 20px;
                      color: #5f5f6b;
                      text-align: center;
                    "
                  >
                    Expires in <span style="color: #a78bfa; font-weight: 600;">${expiresInMinutes} minutes</span>
                  </div>

                  <!-- Security Note -->
                  <table
                    role="presentation"
                    width="100%"
                    cellpadding="0"
                    cellspacing="0"
                    border="0"
                    style="margin-top: 32px;"
                  >
                    <tr>
                      <td
                        style="
                          padding: 14px 16px;
                          background-color: #131320;
                          border-radius: 10px;
                          border: 1px solid #1e1e2b;
                        "
                      >
                        <div style="font-size: 12.5px; line-height: 19px; color: #7c7c8a;">
                          <span style="color: #a1a1ab; font-weight: 600;">Didn't request this?</span>
                          You can safely ignore this email — your account is still secure.
                          Pulse Hub will never ask for this code by phone, chat, or email.
                        </div>
                      </td>
                    </tr>
                  </table>

                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td align="center" style="padding: 28px 32px 36px;">
                  <div style="font-size: 12px; line-height: 18px; color: #45454f;">
                    © ${new Date().getFullYear()} Pulse Hub · Live voting, real opinions.
                  </div>
                </td>
              </tr>

            </table>

            <!-- Outside footer -->
            <div
              style="
                max-width: 480px;
                margin-top: 20px;
                font-size: 11.5px;
                line-height: 17px;
                color: #3a3a42;
                text-align: center;
              "
            >
              This is an automated message from Pulse Hub. Please do not reply.
            </div>

          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
};
