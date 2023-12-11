const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("../Model/user.model");
const userRouter = express.Router();

userRouter.post("/register", async (req, res) => {
  const { name, email, password, role, classgrade, language, subject } =
    req.body;

  try {
    bcrypt.hash(password, 5, async (err, hash) => {
      if (hash) {
        let user = new User({
          name,
          email,
          password: hash,
          role,
          classgrade,
          language,
          subject,
        });
        await user.save();
        res.status(200).send({ msg: "register success" });
      } else {
        res.status(500).send({ msg: "register failed" });
      }
    });
  } catch (err) {
    res.status(500).send("user register failed");
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, password, role } = req.body;

  let user = await User.findOne({ email });
  try {
    if (user) {
      bcrypt.compare(password, user.password, async (err, result) => {
        if (result) {
          let token = jwt.sign({ userID: user._id }, "vinay");
          res
            .status(200)
            .send({
              msg: "login success",
              token,
              role: user.role,
              userId: user._id,
            });
        } else {
          res.status(500).send({ msg: "login failed" });
        }
      });
    }
  } catch (err) {
    res.status(500).send("user login failed");
  }
});

userRouter.get("/user/:id", async (req, res) => {
  const token = req.headers.authorization;
  const decoded = jwt.verify(token, "vinay");
  const { id } = req.params;
  try {
    if (decoded) {
      let user = await User.findOne({ _id: id });
      res.status(200).send(user);
    }
  } catch (err) {
    res.status(500).send("please login first");
  }
});



module.exports = { userRouter };
