import { Response } from "express";
import { validationResult } from "express-validator";
import HttpStatusCodes from "http-status-codes";

import Profile, { TProfile, IProfile } from "../models/Profiles";
import User, { IUser, TUser } from "../models/User";
import Request from "../types/Request";

export const insertProfile = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(HttpStatusCodes.BAD_REQUEST)
      .json({ errors: errors.array() });
  }

  const {
    firstName,
    lastName,
    username,
    dateofbirth,
    gender,
    phone,
    address,
    city,
    country,
    pincode,
  } = req.body;

  const profileFields: TProfile = {
    user: req.userId,
    firstName,
    lastName,
    username,
    gender,
    phone,
    address,
    city,
    country,
    pincode,
    dateofbirth,
  };

  let user: IUser = await User.findOne({ _id: profileFields.user }).select(
    "_id email"
  );

  if (!user) {
    return res.status(HttpStatusCodes.BAD_REQUEST).json({
      errors: [
        {
          msg: "User not registered",
        },
      ],
    });
  }

  let profile: IProfile = await Profile.findOne({ user: req.userId });

  if (profile) {
    profile = await Profile.findOneAndUpdate(
      { user: req.userId },
      { $set: profileFields },
      { new: true }
    );

    return res.json(profile);
  }

  profile = new Profile(profileFields);
  await profile.save();

  res.json(profile);
};

export const getProfile = async (req: Request, res: Response) => {
  const profiles: IProfile[] = await Profile.find().populate("user", [
    "avatar",
    "email",
  ]);
  res.json(profiles);
};
