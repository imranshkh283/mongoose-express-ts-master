import { Document, model, Schema } from "mongoose";

export type TCustomer = {
    customerEmail: string;
    cusPassword: string;
    /* firstName: string;
    lastName: string;
    mobileNumber: number; */
};

export interface ICustomer extends TCustomer, Document {}

const CustomerSchema:Schema = new Schema({
    customerEmail:{
        type:String,
        required:true
    },
    cusPassword:{
        type:String,
        required:true
    },
    /* firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    mobileNumber:{
        type:Number,
        required:true,
    }, */
    updated: Date,
    created: {
        type: Date,
        default: Date.now
    }
})

const Customer = model<ICustomer>('Customer',CustomerSchema);

export default Customer;