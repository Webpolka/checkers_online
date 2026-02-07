import { Router } from "express"
import { loginController, refreshController, logoutController } from "./auth.controller.js";

export const authRouter = Router()

authRouter.post("/login", loginController)
authRouter.get("/refresh", refreshController)
authRouter.post("/logout", logoutController)
