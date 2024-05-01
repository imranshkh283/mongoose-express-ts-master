import { Document, model, Schema } from "mongoose";

export type ReturnType = {
  code: number;
  message: string;
};

export type GenericRecord<K extends keyof any, V> = Record<K, V>;

export type TCategory = {
  categoryname: string;
};

export interface ICategory extends TCategory, Document {}

const categoryScheme: Schema = new Schema({
  categoryname: {
    type: String,
    required: true,
    unique: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Category = model<ICategory>("Category", categoryScheme);

export default Category;
