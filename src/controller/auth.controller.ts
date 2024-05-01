import { Request, Response } from "express";
import { validationResult } from "express-validator";
import HttpStatusCodes from "http-status-codes";
import { findUserByEmail } from "./user.controller";
import { passwordCompare } from "../utils/bcryptUtils";
import Payload from "Payload";
import { generateToken } from "../utils/jwtToken";
import User, { IUser } from "../models/User";

export const login = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(HttpStatusCodes.BAD_REQUEST)
      .json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  let user = await findUserByEmail(email);

  if (!user) {
    return res.status(HttpStatusCodes.UNAUTHORIZED).json({
      errors: [
        {
          msg: "Invalid Credentials",
        },
      ],
    });
  }

  const isMatch = await passwordCompare(password);

  if (!isMatch) {
    return res.status(HttpStatusCodes.BAD_REQUEST).json({
      errors: [
        {
          msg: "Invalid Credentials",
        },
      ],
    });
  }

  const payload: Payload = {
    userId: user.id,
  };

  const { _id, avatar } = user;

  const token = await generateToken(payload, process.env.jwtSecret, "1d");
  res.status(HttpStatusCodes.OK).json({ _id, avatar, email, token });
};

export const IAuth = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const user: IUser = await User.findById(userId).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
};
