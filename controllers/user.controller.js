// // controllers/User.controller.js
// import { User } from "../models/User.model.js";
// import bcrypt from "bcrypt";
// import { UploadCloudinary } from "../utils/cloudinary.js";

// // ✅ Token function
// const Token = async (userid) => {
//   const user = await User.findById(userid);
//   if (!user) throw new Error("User not found for token");
//   const accessToken = user.generateToken();
//   await user.save({ validateBeforeSave: false });
//   return { accessToken };
// };

// // ✅ Register User
// export const Registeruser = async (req, res) => {
//   try {
//     const { username, email, password, address } = req.body;

//     if ([username, email, password, address].some(f => !f || f.trim() === "")) {
//       return res.status(400).json({ success: false, message: "All fields are required" });
//     }

//     const existed = await User.findOne({ email });
//     if (existed) return res.status(400).json({ success: false, message: "User already exists" });

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const avatarLocalPath = req.files?.avatar?.[0]?.path;
//     if (!avatarLocalPath) return res.status(400).json({ success: false, message: "Avatar file required" });

//     const avatarimg = await UploadCloudinary(avatarLocalPath);
//     if (!avatarimg) return res.status(400).json({ success: false, message: "Avatar upload failed" });

//     const createUser = await User.create({
//       username,
//       email,
//       password: hashedPassword,
//       avatar: avatarimg.url,
//       address
//     });

//     res.status(201).json({ success: true, message: "User Registered Successfully", user: createUser });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ success: false, message: "Server Error", error: error.message });
//   }
// };

// // ✅ Login User
// export const LoginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     if (!email || !password) return res.status(400).json({ success: false, message: "Email and Password required" });

//     const user = await User.findOne({ email });
//     if (!user) return res.status(401).json({ success: false, message: "User does not exist" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(401).json({ success: false, message: "Invalid password" });

//     const { accessToken } = await Token(user._id);

//     const cookieOptions = {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "none"
//     };

//     res.status(200)
//       .cookie("accessToken", accessToken, cookieOptions)
//       .json({ success: true, message: "User logged in successfully", user, accessToken });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ success: false, message: "Server error", error: error.message });
//   }
// };

// // ✅ Update Profile
// export const UpdateProfile = async (req, res) => {
//   try {
//     const { username, email, password, address } = req.body;

//     if ([username, email, password, address].some(f => !f || f.trim() === "")) {
//       return res.status(400).json({ success: false, message: "All fields are required" });
//     }

//     const updateData = { username, email, address };

//     if (password) {
//       updateData.password = await bcrypt.hash(password, 10);
//     }

//     if (req.file) {
//       const avatarimg = await UploadCloudinary(req.file.path);
//       if (!avatarimg) return res.status(400).json({ success: false, message: "Avatar upload failed!" });
//       updateData.avatar = avatarimg.url;
//     }

//     const user = await User.findByIdAndUpdate(req.user._id, updateData, { new: true });
//     if (!user) return res.status(400).json({ success: false, message: "User Not Updated" });

//     res.status(200).json({ success: true, message: "Profile updated successfully!", user });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };
 
// // ✅ Logout User
// export const LogoutUser = async (req, res) => {
//   await User.findByIdAndUpdate(req.user._id, { $set: { accessToken: undefined } });

//   const options = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "none" };

//   res.status(200)
//     .clearCookie("accessToken", options)
//     .json({ success: true, message: "User Logout Successfully" });
// };

// // ✅ Get User
// export const GetUser = async (req, res) => {
//   try {
//     const user = req.user;
//     if (!user) return res.status(404).json({ success: false, message: "User Not Found" });

//     res.status(200).json({ success: true, user });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };
import { User } from "../models/User.model.js";
import bcrypt from "bcrypt";
import { UploadCloudinary } from "../utils/cloudinary.js";

// Generate Token
const Token = async (userid) => {
  const user = await User.findById(userid);
  if (!user) throw new Error("User not found");
  const accessToken = user.generateToken();
  await user.save({ validateBeforeSave: false });
  return { accessToken };
};

// Register User
export const Registeruser = async (req, res) => {
  try {
    const { username, email, password, address } = req.body;

    if ([username, email, password, address].some(f => !f || f.trim() === ""))
      return res.status(400).json({ success: false, message: "All fields are required" });

    const existed = await User.findOne({ email });
    if (existed) return res.status(400).json({ success: false, message: "User already exists" });

    if (!req.file) return res.status(400).json({ success: false, message: "Avatar file required" });

    const avatarimg = await UploadCloudinary(req.file.buffer);
    if (!avatarimg) return res.status(400).json({ success: false, message: "Avatar upload failed" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const createUser = await User.create({
      username,
      email,
      password: hashedPassword,
      avatar: avatarimg.secure_url,
      address
    });

    res.status(201).json({ success: true, message: "User Registered Successfully", user: createUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// Login User
export const LoginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: "Email and Password required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ success: false, message: "User does not exist" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: "Invalid password" });

    const { accessToken } = await Token(user._id);

    res.status(200)
      .cookie("accessToken", accessToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "none" })
      .json({ success: true, message: "User logged in successfully", user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Update Profile
export const UpdateProfile = async (req, res) => {
  try {
    const { username, email, password, address } = req.body;

    if ([username, email, password, address].some(f => !f || f.trim() === ""))
      return res.status(400).json({ success: false, message: "All fields are required" });

    const updateData = { username, email, address };

    if (password) updateData.password = await bcrypt.hash(password, 10);
    if (req.file) {
      const avatarimg = await UploadCloudinary(req.file.buffer);
      if (!avatarimg) return res.status(400).json({ success: false, message: "Avatar upload failed" });
      updateData.avatar = avatarimg.secure_url;
    }

    const user = await User.findByIdAndUpdate(req.user._id, updateData, { new: true });
    res.status(200).json({ success: true, message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Logout User
export const LogoutUser = async (req, res) => {
  res.clearCookie("accessToken", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "none" });
  res.status(200).json({ success: true, message: "User logged out successfully" });
};

// Get User
export const GetUser = async (req, res) => {
  if (!req.user) return res.status(404).json({ success: false, message: "User not found" });
  res.status(200).json({ success: true, user: req.user });
};
