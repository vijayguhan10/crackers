const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();
const app = express();
app.use(cors());

const userRouter = require("./route/userRoute");
const productRouter = require("./route/productRoute");
const companyRouter = require("./route/companyRoute");
const orderRouter = require("./route/orderRoute");
const customerRouter = require("./route/customerRoute");
app.use(morgan("dev"));
app.use(express.json());
app.use("/api/userAuth", userRouter);
app.use("/api/product", productRouter);
app.use("/api/company", companyRouter);
app.use("/api/order", orderRouter);
app.use("/api/customer", customerRouter);
const DB = process.env.DATABASE.replace("<DATABASE>", "cracker");
mongoose
  .connect(DB)
  .then(() => {
    console.log("DB connected sucessfully");
  })
  .catch((err) => {
    console.error("DB connection error:", err.message);
  });

app.listen(8000, () => {
  console.log("Running on port 8000");
});
