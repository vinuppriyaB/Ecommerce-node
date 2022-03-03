const router = require("express").Router();
const Order = require("../models/Order");

const CryptoJS = require("crypto-js");
var jwt = require("jsonwebtoken");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

// create
// verifyToken
router.post("/", verifyToken, async (req, res) => {
  const newOrder = new Order(req.body);
  try {
    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

// //update
// verifyTokenAndAdmin
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updateOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).send(updateOrder);
  } catch (err) {
    res.status(500).send(err);
  }
});
// Delete
// verifyTokenAndAdmin
router.delete("/:id", async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);

    res.status(200).json("product has been deleted");
  } catch (err) {
    res.status(500).send(err);
  }
});

// Get user order
// verifyTokenAndAuthorization;
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const order = await Order.findOne({ userId: req.params.userId });

    res.status(200).json(order);
  } catch (err) {
    res.status(500).json(err);
  }
});
// get all carts
// verifyTokenAndAdmin
router.get("/", async (req, res) => {
  try {
    const order = await Order.find();

    res.status(200).json(order);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get monthly income
// verifyTokenAndAdmin;
router.get("/income", async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  try {
    const order = await Order.aggregate([
      { $match: { createdAt: { $gte: previousMonth } } },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);

    res.status(200).json(order);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
