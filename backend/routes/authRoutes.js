import express from "express";
import bcrypt from "bcrypt";
import User from "../models/userSchema.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { sendOtp } from "../utils/sendOtp.js";

const router = express.Router();


router.post("/sendotp",async (req,res) => {
    try{
        const email = req.body.email.toLowerCase().trim();

        if (!email) {
          return res.status(400).json({ message: "Email is required" });
        }

        let user = await User.findOne({email});

        if(!user) return res.status(400).json({message:"User Not Found"});

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const hashOtp = await bcrypt.hash(otp,10);

        user.otpHash = hashOtp;
        user.otpExpiry = new Date(Date.now() + 2 * 60 * 1000);

        await user.save();

        await sendOtp(email,otp);

        res.json({message:"OTP sent to mail"});
    }
    catch(error){
        res.status(500).json({message: error.message});
    }
})


router.post("/verifyotp", async(req,res) => {
    try{
        const otp = req.body.otp;
        const email = req.body.email.toLowerCase().trim();

        if(!otp) return res.status(400).json({message:"OTP  is required"});

        const user = await User.findOne({email});

        if(!user.otpHash) return res.status(400).json({message:"OTP not generated"});

        if(Date.now() > user.otpExpiry) return res.status(400).json({message:"OTP expired"});

        const isValid = await bcrypt.compare(otp,user.otpHash);

        if(!isValid) return res.status(400).json("Incorrect OTP");

        user.isVerified = true;
        user.otpHash = undefined;
        user.otpExpiry = undefined;

        await user.save();

        res.status(200).json({message:"OTP Verified Successfully"});
    }
    catch (error) {
    res.status(500).json({ message: error.message });
  }
})

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    // Never reveal whether email exists
    if (!user) {
      return res.status(200).json({
        message: "If an account exists, a reset link has been sent."
      });
    }

    // Generate raw token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Store only hashed token in DB
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes

    await user.save();

    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      to: user.email,
      subject: "Password Reset Request",
      html: `
        <h3>Password Reset</h3>
        <p>You requested to reset your password.</p>
        <p>Click the link below:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>This link expires in 15 minutes.</p>
      `
    });

    return res.status(200).json({
      message: "If an account exists, a reset link has been sent."
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Something went wrong"
    });
  }
});


router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired reset link"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    user.password = hashedPassword;

    // Remove token after use
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return res.status(200).json({
      message: "Password reset successful"
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Something went wrong"
    });
  }
});

export default router;