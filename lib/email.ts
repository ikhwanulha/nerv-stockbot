import nodemailer from "nodemailer";

// Konfigurasi transporter email menggunakan SMTP
// Ganti dengan credentials SMTP Anda di .env.local
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendPasswordResetEmail(
  email: string,
  resetLink: string
) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  try {
    await transporter.sendMail({
      from: `"NERV StockBot" <${process.env.EMAIL_FROM || "noreply@nerv-stockbot.com"}>`,
      to: email,
      subject: "Reset Password - NERV StockBot",
      html: `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #0a0a0f; color: #e0e0e0; border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 24px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 20px; letter-spacing: 1px;">NERV STOCKBOT</h1>
            <p style="color: #a7f3d0; margin: 4px 0 0 0; font-size: 12px;">Reset Password</p>
          </div>
          <div style="padding: 32px 24px;">
            <h2 style="color: #10b981; font-size: 18px; margin: 0 0 16px 0;">Atur Ulang Password Anda</h2>
            <p style="font-size: 14px; line-height: 1.6; margin: 0 0 24px 0;">
              Kami menerima permintaan reset password untuk akun NERV StockBot Anda. 
              Klik tombol di bawah untuk membuat password baru:
            </p>
            <a href="${resetLink}" 
               style="display: inline-block; background: #10b981; color: white; padding: 12px 32px; 
                      border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;
                      letter-spacing: 0.5px;">
              Reset Password
            </a>
            <p style="font-size: 12px; color: #9ca3af; margin: 24px 0 0 0; line-height: 1.5;">
              Link ini akan kedaluwarsa dalam 1 jam. Jika Anda tidak meminta reset password, 
              abaikan email ini.
            </p>
            <p style="font-size: 12px; color: #6b7280; margin: 16px 0 0 0;">
              Atau salin link berikut: 
              <br/>
              <span style="color: #34d399; word-break: break-all;">${resetLink}</span>
            </p>
          </div>
          <div style="border-top: 1px solid #1f2937; padding: 16px 24px; text-align: center; font-size: 11px; color: #6b7280;">
            &copy; 2024 NERV StockBot. All rights reserved.
          </div>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, error };
  }
}
