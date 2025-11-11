import { Router } from "express";
import { authController } from "./index.js";
import { authenticate } from "./auth.middleware.js";

const router = Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/me", authenticate, authController.getCurrentUser);

export default router;

