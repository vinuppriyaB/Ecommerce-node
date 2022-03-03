const router = require("express").Router();
const Product = require("../models/Product");

const CryptoJS = require("crypto-js");
var jwt = require("jsonwebtoken");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

// verifyTokenAndAdmin
router.post("/", async (req, res) => {
  const newProduct = new Product(req.body);
  try {
    const savedproduct = await newProduct.save();
    res.status(200).json(savedproduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

// //update
// verifyTokenAndAdmin
router.put("/:id", async (req, res) => {
  try {
    const updateProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).send(updateProduct);
  } catch (err) {
    res.status(500).send(err);
  }
});
// Delete
// verifyTokenAndAdmin
router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json("product has been deleted");
  } catch (err) {
    res.status(500).send(err);
  }
});

// Get product
router.get("/find/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    //    console.log(product)

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});
// get all product
router.get("/", async (req, res) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;

  try {
    let products;
    if (qNew) {
      product = await Product.find().sort({ createdAt: -1 }).limit(5);
    } else if (qCategory) {
      product = await Product.find({
        categories: {
          $in: [qCategory],
        },
      });
    } else {
      product = await Product.find();
    }
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
