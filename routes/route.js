// import { Router } from "express";
// import { verifyToken } from "../middlewares/Auth.middleware.js";
// import { upload } from "../middlewares/multer.middleware.js";
// import {
//   GetUser,
//   LoginUser,
//   LogoutUser,
//   Registeruser,
//   UpdateProfile,
// } from "../controllers/user.controller.js";


// const router = Router();


// router.route("/register").post(
//   upload.fields([
//     {
//       name: "avatar",
//       maxCount: 1,
//     },
//   ]),
//   Registeruser,
// );
// router.route("/login").post(LoginUser);
// router
//   .route("/updateprofile/:id")
//   .put(upload.single("avatar"), verifyToken, UpdateProfile);
// router.route("/logout").post(verifyToken, LogoutUser);
// router.route("/getuser").get(verifyToken, GetUser);
// export default router;

import express from "express";
import { Registeruser, LoginUser, UpdateProfile, LogoutUser, GetUser } from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/Auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.post("/register", upload.single("avatar"), Registeruser);
router.post("/login", LoginUser);
router.put("/updateprofile/:id", verifyToken, upload.single("avatar"), UpdateProfile);
router.post("/logout", verifyToken, LogoutUser);
router.get("/getuser", verifyToken, GetUser);

export default router;
