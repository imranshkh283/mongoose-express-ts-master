import bodyParser from "body-parser";
import express from "express";
import * as dotenv from "dotenv";
import connectDB from "../config/database";
import auth from "./routes/api/auth";
import user from "./routes/api/user";
import profile from "./routes/api/profile";
import category from "./routes/api/category";
import subcategory from "./routes/api/subcategory";
import product from "./routes/api/product";
import customer from "./routes/api/customer";
import cart from "./routes/api/cart";
import order from "./routes/api/order";
const app = express();
dotenv.config();
// Connect to MongoDB
connectDB();

// Express configuration
app.set("port", process.env.PORT || 5000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// @route   GET /
// @desc    Test Base API
// @access  Public
app.get("/", (_req, res) => {
  res.send("API Running");
});

app.use("/api/auth", auth);
app.use("/api/user", user);
app.use("/api/profile", profile);
app.use("/api/category", category);
app.use("/api/product", product);
app.use("/api/subcategory", subcategory);
app.use("/api/customer", customer);
app.use("/api/cart", cart);
app.use("/api/order", order);

const port = app.get("port");
const server = app.listen(port, () =>
  console.log(`Server started on port ${port}`)
);

export default server;
