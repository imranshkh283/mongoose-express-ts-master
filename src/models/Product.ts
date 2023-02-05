import { Document, model, Schema } from 'mongoose';

import { ICategory, TCategory } from "./Category";
import { ISubCategory, TSubCategory } from './SubCategory';

export type TProducts = {
    category:ICategory["_id"];
    subcategory:ISubCategory["_id"];
    productname:string;
    price:number;
    description:string;
}

export interface IProduct extends TSubCategory, Document {}

const productScheme: Schema = new Schema({
    category:{
        type:Schema.Types.ObjectId,
        ref:'Category'
    },
    subcategory:{
        type:Schema.Types.ObjectId,
        ref:"Subcategory"
    },
    productname : {
        type: String,
        required: true,
    },
    description:{
        type:String,
    },
    price:{
        type:Number,
        required:true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
}, {timestamps:true})

const Product = model<IProduct>("Product", productScheme);

export default Product;