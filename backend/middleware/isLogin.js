const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const isLogin = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).send({
        success: false,
        message: "User unauthorize",
      });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if (!decode) {
      return res.status(500).send({
        success: false,
        message: "User unauthorize - Invalid token",
      });
    }

    const user = await User.findById(decode.userId).select("-password");
    if (!user) {
      return res.status(500).send({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: error,
    });
  }
};

module.exports = isLogin;
