import { User } from "../models/User.model.js";
import bcrypt from "bcrypt";
import { UploadCloudinary } from "../utils/cloudinary.js";

const Token = async(userid) => {
  try {
    const user = await User.findById(userid);
    const accessToken = user.generateToken();

    await user.save({ validateBeforeSave: false });

    return { accessToken };
  } catch (error) {
    console.log(error);

    res.status(400).json({
      success: false,
      message: "Not Get Token User",
      error,
    });
  }
};
const Registeruser = async (req, res) => {
  try {
    const { username, email, password, address } = req.body;

    // Validation (remove avatar from here)
    if (
      [username, email, password, address].some(
        (field) => !field || field.trim() === ""
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check user exists
    const existed = await User.findOne({ email });
    if (existed) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Multer file path
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    if (!avatarLocalPath) {
      return res.status(400).json({
        success: false,
        message: "Avatar file is required",
      });
    }

    // Upload to Cloudinary
    const avatarimg = await UploadCloudinary(avatarLocalPath);

    console.log("Cloudinary upload response:", avatarimg);

    if (!avatarimg) {
      return res.status(400).json({
        success: false,
        message: "Avatar upload failed",
      });
    }

    // Create user
    const createUser = await User.create({
      username,
      email,
      password: hashedPassword,
      avatar: avatarimg.url,
      address,
    });

    return res.status(201).json({
      success: true,
      message: "User Registered Successfully",
      user: createUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
// const LoginUser = async (req, res) => {
//   const { email, password } = req.body;

//   if (!email) {
//     res.status(404).json({
//       success: false,
//       message: "Email is required",
//     });
//   }
//   if (!password) {
//     res.status(404).json({
//       success: false,
//       message: "Password is required",
//     });
//   }
//   const user = await User.findOne({
//     $or: [{ email: email }, { password: password }],
//   });
//   if (!user) {
//     res.status(400).json({
//       success: false,
//       message: "User alreday Exist",
//     });
//   }
//   const MatchPasword = await bcrypt.compare(password,user.password)

//   if (!MatchPasword) {
//     res.status(404).json({
//       success:false,
//       message:"Password is Invalid"
//     })
//   }

//   const  {accessToken} = await Token(user._id)

//   const loggedInUser = await  User.findById(user._id)

//   if (!loggedInUser) {
//     res.status(400).json({
//       success:false,
//       message:"User Not Looged In"
//     })
//   }

//   const options = {
//     httpOnly:true,
//     secure:true
//   }
//   return res.status(200)
//   .cookie("accessToken",accessToken,options)
//   .json({
//     success:true,
//     message:" User Logged in Successfully",
//       user:loggedInUser,accessToken
    
//   })
  
// };


export const LoginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User does not exist",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    // Generate JWT token
    const { accessToken } = await Token(user._id);

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // HTTPS only on Vercel
      sameSite: "none",
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .json({
        success: true,
        message: "User logged in successfully",
        user,
        accessToken,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const UpdateProfile = async (req, res) => {
  try {
    const { username, email, password, address } = req.body;

    // Validation
    if ([username, email, password, address].some(f => !f || f.trim() === "")) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const updateData = { username, email, address };

    // Password update
    if (password) {
      const bcrypt = await import("bcrypt");
      updateData.password = await bcrypt.hash(password, 10);
    }

    // Avatar update if file uploaded
    if (req.file) {
      const avatarimg = await UploadCloudinary(req.file.path);
      if (!avatarimg) {
        return res.status(400).json({
          success: false,
          message: "Avatar upload failed!",
        });
      }
      updateData.avatar = avatarimg.url;
    }

    // Update user by token id (req.user set by JWT middleware)
    const user = await User.findByIdAndUpdate(req.user._id, updateData, { new: true });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User Not Updated",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully!",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const LogoutUser = async(req,res) =>{
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set:{
        accessToken:undefined
      }
    }
  )
  const options = {
    httpOnly:true,
    secure:true
  }
   return res.status(200)
   .clearCookie('accessToken',options)
   .json({
    success:true,
    message:"User Logout Successfully"
   })
}
const GetUser = async(req,res) => {
  try {
       const user = req.user
       
       if (!user) {
        return res.status(404).json({
          success:false,
          message:"User Not Found"
        })
    
       }
           res.status(200).json({
          success:true,
          user
        })

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success:false,
      message:error.message
    })
  }
}

export { Registeruser, LoginUser,UpdateProfile,LogoutUser,GetUser };
