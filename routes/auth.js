const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
var jwt = require("jsonwebtoken");

//registration
router.post("/register", async (req, res) => {
  // console.log(req.body);
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.SECRET_KEY
    ).toString(),
  });
  try {
    const savedUser = await newUser.save();
    // console.log(savedUser)
    res.status(200).send(savedUser);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/login", async (req, res) => {
  console.log(req.body);

  try {
    const user = await User.findOne({ email: req.body.email });
    !user && res.status(500).send({ msg: "invalide user" });

    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.SECRET_KEY
    );
    let orriginalpassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    orriginalpassword !== req.body.password &&
      res.status(401).send({ msg: "wrong credential" });

    var token = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "3d" }
    );

    const { password, ...others } = user._doc;
    res.status(200).send({ ...others, token });
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
