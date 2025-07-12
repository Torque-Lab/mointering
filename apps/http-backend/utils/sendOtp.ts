import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();
const API_KEY = process.env.RESEND_API_KEY ||"njdhf87y4hbvfj";
const resend = new Resend(API_KEY);




export async function sendOTPEmail(to: string, otp: string, mainSubject?: string) {
  try {
    const response = await resend.emails.send({
      from: "sitewatch<noreply@suvidhaportal.com>",
      to: to,
      subject: mainSubject || "Your OTP Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h2 style="color: #111827;">Your One-Time Password (OTP)</h2>
          <p style="font-size: 16px; color: #374151;">
            Use the following OTP to complete your verification. This code is valid for <strong>15 minutes</strong>.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="display: inline-block; background-color: #f3f4f6; color: #111827; padding: 12px 24px; font-size: 24px; font-weight: bold; letter-spacing: 4px; border-radius: 8px; border: 1px solid #d1d5db;">
              ${otp}
            </span>
          </div>
          <p style="font-size: 14px; color: #6b7280;">
            If you didn’t request this code, you can safely ignore this email.
          </p>
          <hr style="margin: 24px 0; border: none; border-top: 1px solid #e5e7eb;" />
          <p style="font-size: 12px; color: #9ca3af; text-align: center;">
            &copy; ${new Date().getFullYear()} SiteWatch | <a href="https://sitewatch.suvidhaportal.com" style="color: #2563eb; text-decoration: none;">sitewatch.suvidhaportal.com</a>
          </p>
        </div>
      `,
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
      subject: `⚠️ Service Alert: ${serviceName} is Down`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h2 style="color: #111827;">Service Down Alert</h2>
          <div style="padding: 16px; background-color: #fef2f2; border: 1px solid #fca5a5; border-radius: 6px; margin-bottom: 20px;">
            <p style="font-size: 16px; color: #b91c1c; margin: 0;">
              🚨 The service <strong>${serviceName}</strong> is currently <strong>DOWN</strong>.
            </p>
          </div>
          <p style="font-size: 15px; color: #374151;">
            Please review the service immediately. If you are not responsible for this service, kindly forward this message to the appropriate team.
          </p>
          <p style="font-size: 14px; color: #6b7280;">
            This automated alert was triggered by SiteWatch monitoring.
          </p>
          <hr style="margin: 24px 0; border: none; border-top: 1px solid #e5e7eb;" />
          <p style="font-size: 12px; color: #9ca3af; text-align: center;">
            &copy; ${new Date().getFullYear()} SiteWatch | <a href="https://sitewatch.suvidhaportal.com" style="color: #2563eb; text-decoration: none;">sitewatch.suvidhaportal.com</a>
          </p>
        </div>
      `,
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
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h2 style="color: #111827;">Reset Your Password</h2>
          <p style="font-size: 16px; color: #374151;">
            We received a request to reset your password. Click the button below to choose a new one.
          </p>
          <p style="text-align: center; margin: 30px 0;">
            <a href="${link}" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; font-size: 16px; font-weight: bold; text-decoration: none; border-radius: 6px;">
              Reset Password
            </a>
          </p>
          <p style="font-size: 14px; color: #6b7280;">
            This link will expire in 15 minutes. If you didn't request this, you can safely ignore this email.
          </p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;" />
          <p style="font-size: 12px; color: #9ca3af; text-align: center;">
            &copy; ${new Date().getFullYear()} SiteWatch | <a href="https://sitewatch.suvidhaportal.com" style="color: #2563eb; text-decoration: none;">sitewatch.suvidhaportal.com</a>
          </p>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
}

