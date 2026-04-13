import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
        service:"gmail",
        auth:{
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

export const sendOtp = async (email,otp) => {
  await transporter.sendMail({
    from: `<${process.env.EMAIL_USER}>`,
    to: email,
    subject : "Your OTP (Valid for 2 minutes)",
    text: `Your OTP is ${otp}. It is valid for 2 minutes.`
  });
};


