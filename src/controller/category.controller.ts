import { Router, Response } from "express";
import { check, validationResult } from "express-validator";
import HttpStatusCodes from "http-status-codes";
import Request from "../types/Request";

import Category, { GenericRecord } from "../models/Category";

export const createCategory = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(HttpStatusCodes.BAD_REQUEST)
      .json({ errors: errors.array() });
  }

  let categoryname = req.body;

  await categoryExist(req, res);
  const category = new Category(categoryname);

  categoryname = await category.save();

  return res.json(category);
};

const categoryExist = async (
  req: Request,
  res: Response
): Promise<GenericRecord<string, any>> => {
  let category = await Category.findOne({
    categoryname: req.body.categoryname,
  });
  if (category) {
    return res.json({
      code: HttpStatusCodes.BAD_REQUEST,
      message: "Category already exists",
    });
  }
};
