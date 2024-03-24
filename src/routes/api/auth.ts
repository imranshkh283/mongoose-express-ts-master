import { Router, Response } from "express";
import { check } from "express-validator";
import auth from "../../middleware/auth";
import { login, IAuth } from "../../controller/auth.controller";

const router: Router = Router();

router.get("/", auth, IAuth);

router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  login
);

export default router;
