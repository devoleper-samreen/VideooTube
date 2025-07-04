import nodemailer from "nodemailer";
import EmailVerification from "../models/emailVerification.js";
import dotenv from "dotenv";
dotenv.config();

console.log(process.env.AUTH_PASS);
export const transport = nodemailer.createTransport({
  service: "gmail",
  secure: true,
  port: 465,
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.AUTH_PASS,
  },
});

export const sendEmailOTP = async (req, user) => {
  try {
    const otp = Math.floor(1000 + Math.random() * 9000);

    await new EmailVerification({
      userId: user._id,
      otp: otp,
    }).save();

    const otpVerificationLink = `${process.env.FRONTEND_HOST}/account/verify-email`;

    await transport.sendMail({
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: "verify your email",
      html: `<p>${otpVerificationLink} <br>
            <h1> ${otp} </h1>
            </p>`,
    });

    console.log("OTP sent successfully:", otp);

    return otp;
  } catch (error) {
    console.error("Error in sendEmailOTP:", error);
    throw new Error("Failed to send OTP email");
  }
};
