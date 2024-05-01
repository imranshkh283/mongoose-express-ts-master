import bcrypt from "bcryptjs";
import { Router, Response } from "express";
import { check, validationResult } from "express-validator";

import HttpStatusCodes from "http-status-codes";
import jwt from "jsonwebtoken";

import Payload from "../types/Payload";
import Request from "../types/Request";
import User, { IUser, TUser } from "../models/User";
import { passwordBcrypt } from "../utils/bcryptUtils";
import { generateToken } from "../utils/jwtToken";
import { createGravatar } from "../utils/gravatar";

export const userRegister = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(HttpStatusCodes.BAD_REQUEST)
      .json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  const user = await userAlreadyExist(req, res);

  if (user) {
    return res.status(HttpStatusCodes.BAD_REQUEST).json({
      errors: [{ msg: "User already exists" }],
    });
  }

  const avatar = await createGravatar(email);

  const hashedPassword = await passwordBcrypt(password);

  const newUser = new User({
    email,
    password: hashedPassword,
    avatar,
  });

  await newUser.save();

  const payload: Payload = {
    userId: newUser.id,
  };

  const token = await generateToken(payload, process.env.jwtSecret, "1d");
  res.status(HttpStatusCodes.OK).json({ token });
};

export const userAlreadyExist = async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  return user;
};

export const findUserByEmail = async (email: string) => {
  const user = await User.findOne({ email });
  return user;
};
