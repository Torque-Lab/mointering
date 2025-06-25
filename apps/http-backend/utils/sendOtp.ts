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

    console.log("Email sent:", response);
    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
}