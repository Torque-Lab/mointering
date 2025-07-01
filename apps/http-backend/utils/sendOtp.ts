import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();


const API_KEY = process.env.RESEND_API_KEY;
if (!API_KEY) {
  throw new Error("RESEND_API_KEY is not defined");
}
const resend = new Resend(API_KEY);

export async function sendOTPEmail(to: string, otp: string) {
  try {
    const response = await resend.emails.send({
      from: "sitewatch<noreply@suvidhaportal.com>",
      to: to,
      subject: "Your OTP Code",
      text: `Your OTP is: ${otp}\nIt expires in 15 minutes.`,
    });
    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
}

export async function sendPasswordResetEmail(to: string, link: string) {
  try {
    const response = await resend.emails.send({
      from: "sitewatch<noreply@suvidhaportal.com>",
      to: to,
      subject: "Your Password Reset Link",
      html: `<h2>Click the button below to reset your password:</h2>
        <button style="background-color: #2563eb; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;"><a href="${link}">Reset Password</a></button>
        <p>This link will expire in 15 minutes.</p>`,
    });
    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
}
