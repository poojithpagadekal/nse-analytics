import { Router } from "express";
import { authController } from "./auth.controller";
import { authenticate } from "../../middlewares/authenticate";

export const authRouter = Router();

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);

authRouter.get("/me", authenticate, authController.getMe);
authRouter.patch("/profile", authenticate, authController.updateProfile);
authRouter.patch("/password", authenticate, authController.changePassword);
authRouter.patch("/email", authenticate, authController.changeEmail);
