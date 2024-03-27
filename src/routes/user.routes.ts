import { Router } from "express";
import {
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
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

router.post("/refresh-access-token", refreshAccessToken);

export default router;
