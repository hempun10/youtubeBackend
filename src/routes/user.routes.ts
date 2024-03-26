import { Router } from "express";
import { registerUser } from "../controllers/user.controllers.js";

const router = Router();

// /api/v1/user/register
router.post("/register", registerUser);

export default router;
