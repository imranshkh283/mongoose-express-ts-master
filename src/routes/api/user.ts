import { Router, Response } from "express";
import { check, validationResult } from "express-validator";

import { userRegister } from "../../controller/user.controller";
const router: Router = Router();

// @route   POST api/user
// @desc    Register user given their email and password, returns the token upon successful registration
// @access  Public
router.post(
  "/",
  [
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  userRegister
);

export default router;
