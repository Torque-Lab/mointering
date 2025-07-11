import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();
const API_KEY = process.env.RESEND_API_KEY ||"njdhf87y4hbvfj";
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
export async function sendEmail(to: string, serviceName: string) {
  try {
    const response = await resend.emails.send({
      from: "sitewatch<noreply@suvidhaportal.com>",
      to: to,
      subject: "Service Alert ",
     html: `<h2>Service Alert developer</h2>
     <p>The service ${serviceName} is down.</p>`
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
