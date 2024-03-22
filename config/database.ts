import { connect } from "mongoose";
import * as dotenv from "dotenv";

const connectDB = async () => {
  try {
    const mongoURI: string = process.env.mongoURI;
    await connect(mongoURI);
    console.log("MongoDB Connected...");
  } catch (err) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};

export default connectDB;
