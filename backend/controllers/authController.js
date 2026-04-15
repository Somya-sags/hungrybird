import bcrypt from "bcrypt";
import User from "../models/userSchema.js";
import jwt from "jsonwebtoken";


export const userSignup = async (req,res) => {
    try{
    const name = req.body.name.trim();
    const email = req.body.email.toLowerCase().trim();
    const phone = req.body.phone.trim();
    const password = req.body.password.trim();
    const confirmPassword = req.body.confirmPassword.trim();

    const namePattern = /^[A-Za-z\s]+$/;

    if (!namePattern.test(name)) {
      return res.status(400).json({
        message: "Name must contain only letters and spaces"
      });
    }

    const gmailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    
        if (!gmailPattern.test(email)) {
          return res.status(400).json({message:"Enter valid email format"})
        }
   
    const phonePattern = /^[0-9]{10}$/;

    if(!phonePattern.test(phone)){
      return res.status(400).json({message:"Enter valid Phone Number"});
    }
    
    if(password.length < 5) return res.status(400).json({message:"Length of Password must be atleast 5"});
    if(password != confirmPassword) return res.status(400).json({message:"Passwords don't match"});

    const existingEmail = await User.findOne({email});

    if(existingEmail) return res.status(400).json({message:"Email already registered."});

    const existingPhone = await User.findOne({phone});

    if(existingPhone) return res.status(400).json({message:"Number Already registered."})

    if(phone.length != 10) return res.status(400).json({message:"Enter a valid phone number"});

    const hashedpassword = await  bcrypt.hash(password,10);

    const user = await User.create({
      name,
      email,
      password:hashedpassword,
      phone
    })
    res.status(201).json({message:"Customer Signup Successful"});
  }
  catch(error){
    res.status(500).json({message: error.message});
  }
}

export const userLogin = async (req,res) => {
  try{
    const email = req.body.email.toLowerCase().trim();
    const password = req.body.password;

    if(!email || !password) return res.status(400).json({message:"All Fields are required"});

    let user = await User.findOne({email});

    if(!user) return res.status(400).json({message:"Incorrect Email"});

    if(!user.isVerified){
      return res.status(403).json({message:"Email Not Verified"});
    }

    const isMatch = await bcrypt.compare(password,user.password);
    
    if(!isMatch) return res.status(400).json({message:"Wrong Password"});

    const isAdmin = user.email === process.env.ADMIN_EMAIL;

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        isAdmin: isAdmin,
        name: user.name,
        phone: user.phone
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "7d"
      }
    );

    res.json({
      message: "Login successful",
      token
    });


  }
  catch(error){
    return res.status(500).json({message:error.message});
  }
}

export const  userLogout = async (req,res) => {
  res.json({message:"Logged out Successfully"});
}

export const getMe = async (req,res) => {
    try {
    const user = await User.findById(req.user.userId).select("-password");
    
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
}