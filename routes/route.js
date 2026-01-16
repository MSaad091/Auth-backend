import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
  GetUser,
  LoginUser,
  LogoutUser,
  Registeruser,
  UpdateProfile,
} from "../controllers/user.controller.js";
import { Verijwt } from "../middlewares/Auth.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
  ]),
  Registeruser,
);
router.route("/login").post(LoginUser);
router
  .route("/updateprofile/:id")
  .put(upload.single("avatar"), Verijwt, UpdateProfile);
router.route("/logout").post(Verijwt, LogoutUser);
router.route("/getuser").get(Verijwt, GetUser);
export default router;
