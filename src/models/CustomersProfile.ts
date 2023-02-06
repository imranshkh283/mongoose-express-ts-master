import { Document, model, Schema } from "mongoose";
import { ICustomer } from "./Customers";

export type TCustomerProfile = {
  customerID: ICustomer["_id"];
  firstName: string;
  lastName: string;
  mobileNumber:number;
  address:string;
  city:string;
  country:string;
  pincode:number;
};


export interface ICustomerProfile extends TCustomerProfile, Document {}

const cusProfileSchema: Schema = new Schema({
  customerID: {
    type: Schema.Types.ObjectId,
    ref: "Customer",
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  mobileNumber:{
    type:Number,
    required:false,
  },
  address:{
    type:String,
    required:false,
  },
  city:{
    type:String,
    required:false,
  },
  country:{
    type:String,
    required:false,
  },
  pincode:{
    type:Number,
    required:false,
  },
  updated: {
    type: Date,
    default: Date.now
  }
});


const CustomerProfile = model<ICustomerProfile>("CustomerProfile", cusProfileSchema);

export default CustomerProfile;
