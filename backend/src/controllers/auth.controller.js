import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.token.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
    const { email, fullName, password } = req.body;
  
    try {
      // Validate input
      if (!email || !password || !fullName) {
        return res.status(404).json({
          success: false,
          message: "All fields are required",
        });
      }
  
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 6 characters",
        });
      }
  
      // Check if user already exists
      const user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({
          success: false,
          message: "Email already exists",
        });
      }
  
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Create a new user
      const newUser = new User({
        fullName,
        email,
        password: hashedPassword,
      });
  
      if (newUser) {
        // Generate JWT token and save user
        generateToken(newUser._id, res);
        await newUser.save();
  
        return res.status(201).json({
          success: true,
          user:{
            _id: newUser.id,
            fullName: newUser.fullName,
            email: newUser.email,
            profilePic: newUser.profilePic,
          }
         
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "Invalid user data",
        });
      }
    } catch (error) {
      console.error("Error in signup controller:", error.message);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  };
  
/*---------------------------------------------- */
export const login = async (req, res) => {
const {email,password}=req.body;
try {
    const user = await User.findOne({email})
    if(!user)
    {
        return res.status(400).json({
            success:false,
            message:"User Invalid"
        });
    }
    const isPassword = await bcrypt.compare(password,user.password);
    if(!isPassword)
    {
        return res.status(400).json({
            success:false,
            message:"Password not matched"
        })
    }

    generateToken(user._id,res);

    res.status(200).json({
        success:true,
        user:{
            _id:user._id,
            fullName:user.fullName,
            email:user.email,
            profilePic:user.profilePic,
        }
        
    });
} catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
}

};
/*-------------------------------------------------- */
export const logout = async (req, res) => {
    try {
        res.cookie("token","",{maxAge:0});
        res.status(200).json({
          success:true,
          message:"Logged out Successful"  
        })
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
export const updateProfile=async(req,res)=>{
    try {
        const {profilePic}=req.body;
        const userId=req.user._id;
        if(!profilePic)
        {
            return res.status(400).json({
                success:false,
                message:"Profile pic required"
            })
        }
        const uploadResponse = await cloudinary.uploader.upload(profilePic, {
          folder: "profiles", // Organize uploads in a folder
        });
      
       const updateUser = await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url},{new:true})
 

       res.status(200).json({
        Success:true,
        message:updateUser
       })
       

    } catch (error) {
        console.log("error in update profile:", error);
    res.status(500).json({ message: "Internal server error" });
    }
}

/*----------------------------------------------------- */

export const checkAuth = (req, res) => {
    try {
      // Ensure the user is available in req.user, which should be set by a previous middleware (like protectRoute)
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized - User not found",
        });
      }
  
      // Return the user data in the response
      res.status(200).json(req.user);
    } catch (error) {
      console.log("Error in checkAuth controller", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
