import { Router } from "express";
import {
  changeCurrentPassword,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateAccountDetails,
  updateAvtar,
  updateUserCoverImage,
} from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// /api/v1/user/register
router.post(
  "/register",
  // Adding multer middleware to accept multiple images
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

// /api/v1/user/login
router.post("/login", loginUser);

//Secured Roues

// /api/v1/user/logout
router.post("/logout", verifyJWT, logoutUser);

// /api/v1/user/refresh-access-token
router.post("/refresh-access-token", refreshAccessToken);

// /api/v1/user/change-password
router.post("/change-password", verifyJWT, changeCurrentPassword);

// /api/v1/user/update-account-details
router.post("/update-account-details", verifyJWT, updateAccountDetails);

// /api/v1/user/update-avatar
router.post("/update-avatar", upload.single, updateAvtar);

// /api/v1/user/update-cover-image
router.post("/update-cover-image", upload.single, updateUserCoverImage);

export default router;
