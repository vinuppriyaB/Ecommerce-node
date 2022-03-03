const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
var jwt = require("jsonwebtoken");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

//registration
// verifyTokenAndAuthorization
router.put("/:id", async (req, res) => {
  console.log(req.params.id);
  if (req.body.password)
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.SECRET_KEY
    ).toString();

  try {
    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).send(updateUser);
  } catch (err) {
    res.status(500).send(err);
  }
});
// Delete
// verifyTokenAndAdmin
router.delete("/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json("user has been deleted");
  } catch (err) {
    res.status(500).send(err);
  }
});

// Get
// verifyTokenAndAdmin
router.get("/find/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;

    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});
// get all user
// verifyTokenAndAdmin
router.get("/", async (req, res) => {
  const query = req.query.new;
  try {
    const user = query
      ? await User.find().sort({ _id: -1 }).limit(1)
      : await User.find();

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get user Stats
// verifyTokenAndAdmin
router.get("/stats", async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
  try {
    const data = await User.aggregate([
      { $match: { createdAt: { $gt: lastYear } } },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
