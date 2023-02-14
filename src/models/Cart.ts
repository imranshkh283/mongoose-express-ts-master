import mongoose, { Document, model, mongo, Schema } from 'mongoose';
import { ICustomer } from './customers';
import { IProduct } from './Product';
export type TCart = {
    productId:IProduct["_id"];
    qty:Number;
    price:Number;
    title:String;
    totalQty:Number;
    totalCost:Number;
    customer:ICustomer["_id"];
    createdAt:Date;
}

export interface ICart extends TCart,Document {}

const CartScheme: Schema = new Schema({
    
    productId : {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Products"
    },
    qty:{
        type: Number,
        default: 0,
    },
    price: {
        type: Number,
        default: 0,
    },
    title: {
        type: String,
    },
    totalQty: {
        type: Number,
        default: 0,
        required: true,
    },
    totalCost: {
        type: Number,
        default: 0,
        required: true,
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
})

const Cart = model<ICart>("Cart", CartScheme);

export default Cart;