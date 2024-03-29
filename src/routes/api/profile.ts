import { Router, Response } from "express";
import { check, validationResult } from "express-validator";
import HttpStatusCodes from "http-status-codes";

import auth from "../../middleware/auth";
import Profile, { TProfile, IProfile } from "../../models/Profiles";
import { insertProfile, getProfile } from "../../controller/profile.controller";
import Request from "../../types/Request";
import User, { IUser } from "../../models/User";

const router: Router = Router();

// @route   GET api/profile/me
// @desc    Get current user's profile
// @access  Private
router.get("/me", auth, async (req: Request, res: Response) => {
  try {
    const profile: IProfile = await Profile.findOne({
      user: req.userId,
    }).populate("user", ["avatar", "email"]);
    if (!profile) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({
        errors: [
          {
            msg: "There is no profile for this user",
          },
        ],
      });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
});

// @route   POST api/profile
// @desc    Create or update user's profile
// @access  Private
router.post("/", auth, insertProfile);

// @route   GET api/profile
// @desc    Get all profiles
// @access  Public
router.get("/", auth, getProfile);

// @route   GET api/profile/user/:userId
// @desc    Get profile by userId
// @access  Public
router.get("/user/:userId", async (req: Request, res: Response) => {
  try {
    const profile: IProfile = await Profile.findOne({
      user: req.params.userId,
    }).populate("user", ["avatar", "email"]);

    if (!profile)
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ msg: "Profile not found" });

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ msg: "Profile not found" });
    }
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
});

// @route   DELETE api/profile
// @desc    Delete profile and user
// @access  Private
router.delete("/", auth, async (req: Request, res: Response) => {
  try {
    // Remove profile
    await Profile.findOneAndRemove({ user: req.userId });
    // Remove user
    await User.findOneAndRemove({ _id: req.userId });

    res.json({ msg: "User removed" });
  } catch (err) {
    console.error(err.message);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
});

export default router;
