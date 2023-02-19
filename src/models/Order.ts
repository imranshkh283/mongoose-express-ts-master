import mongoose, { Document, model, mongo, Schema } from "mongoose";
import { ICustomer } from './Customers';
import { IProduct } from "./Product";
import { ICustomerProfile } from "./CustomersProfile";

export type TOrder = {
    customerID: ICustomer["_id"];
    productId:IProduct["_id"];
    totalPrice: number;
    isPaid: boolean;
    paidAt : number;
    isDelivered: boolean;
}

export interface IOrder extends TOrder, Document {}

const orderSchema: Schema = new Schema({
    
    productId : {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Products"
    },
    customerID: {
        type:mongoose.Schema.Types.ObjectId,
        ref: "Customer",
    },
    shippingAddress : {
        address: { type: String, required: true },
        city: { type: String, required: true },
        country: { type: String, required: true },
        pincode: { type: Number, required: true },
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
})

const Order = model<TOrder>("Order", orderSchema);

export default Order;