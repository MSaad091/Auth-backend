import jwt from "jsonwebtoken";
import { User } from "../models/User.model.js";

export const Verijwt = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized User",
      });
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken._id); // Make sure token has { id: user._id }
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid access Token",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid User or Token",
    });
  }
};
// import jwt from 'jsonwebtoken';
// import { User } from '../models/User.model.js';

// export const Verijwt = async (req, res, next) => {
//   try {
//     const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized User"
//       });
//     }

//     const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

//     const user = await User.findById(decodedToken._id);
//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid access Token"
//       });
//     }

//     req.user = user;
//     next();
//   } catch (error) {
//     return res.status(401).json({
//       success: false,
//       message: "Invalid access Token",
//       error: error.message
//     });
//   }
// };

