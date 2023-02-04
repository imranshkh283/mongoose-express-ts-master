import { Document, model, Schema } from 'mongoose';
import { ICategory } from "./Category";

export type TSubCategory = {
    category: string;
    categoryname:ICategory["_id"];
    subcategory:string;
}

export interface ISubCategory extends TSubCategory, Document {}

const subcategoryScheme: Schema = new Schema({
    category:{
        type:Schema.Types.ObjectId,
        ref:'Category'
    },
    subcategory:{
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    }
})

const SubCategory = model<ISubCategory>("SubCategory", subcategoryScheme);

export default SubCategory;