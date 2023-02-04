import { Document, model, Schema } from 'mongoose';

export type TCategory = {
    categoryname:string;
}

export interface ICategory extends TCategory,Document {}

const categoryScheme: Schema = new Schema({
    categoryname : {
        type: String,
        required: true,
        unique: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
})

const Category = model<ICategory>("Category", categoryScheme);

export default Category;