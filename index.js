const express = require("express");
const mongoose = require("mongoose");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const authRoute = require("./routes/auth.js");
const userRoute = require("./routes/user.js");
const productRoute = require("./routes/product.js");
const orderRoute = require("./routes/order.js");
const cartRoute = require("./routes/carts.js");
const stripeRoute = require("./routes/stripe.js");
const bodyparser = require("body-parser");
const path = require("path");

app.use(cors());
app.use(express.json());
dotenv.config();
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("db connected"))
  .catch((err) => {
    console.log(err);
  });

app.get("/", () => {
  console.log("test success");
});

app.use("/api/auth", authRoute);

app.use("/api/user", userRoute);
app.use("/api/product", productRoute);
app.use("/api/order", orderRoute);
app.use("/api/cart", cartRoute);
app.use("/api/checkout", stripeRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("the server is started in", PORT));
