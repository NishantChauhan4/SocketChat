const User = require("../models/userModel");
const bcryptjs = require("bcryptjs");
const jwtFunc = require("../utils/jwt");

const userRegister = async (req, res) => {
  try {
    const { fullname, username, email, gender, password, profilepic } =
      req.body;

    const user = await User.findOne({
      username,
      email,
    });

    if (user) {
      return res.status(500).send({
        success: false,
        message: "Username or email already exist",
      });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const profileBoy =
      profilepic ||
      `https://avatar.iran.liara.run/public/boy/?username=${username}`;
    const profileGirl =
      profilepic ||
      `https://avatar.iran.liara.run/public/girl/?username=${username}`;

    const newUser = new User({
      username,
      fullname,
      email,
      password: hashedPassword,
      gender,
      profilepic: gender === "male" ? profileBoy : profileGirl,
    });

    if (newUser) {
      await newUser.save();
      jwtFunc(newUser._id, res);
    } else {
      res.status(500).send({
        success: false,
        message: "Invalid user data",
      });
    }

    res.status(201).send({
      _id: newUser._id,
      username: newUser.username,
      fullname: newUser.fullname,
      profilepic: newUser.profilepic,
      email: newUser.email,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error,
    });
    console.log(error);
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(500).send({
        success: false,
        message: "Email does not exist",
      });
    }

    const comparePassword = await bcryptjs.compare(password, user.password);
    if (!comparePassword) {
      return res.status(500).send({
        success: false,
        message: "Incorrect password",
      });
    }

    jwtFunc(user._id, res);

    res.status(200).send({
      _id: user._id,
      username: user.username,
      fullname: user.fullname,
      profilepic: user.profilepic,
      email: user.email,
      message: "Successful login",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error,
    });
    console.log(error);
  }
};

const userLogout = (req, res) => {
  try {
    res.clearCookie("jwt");
    res.status(200).send({
      success: true,
      message: "User logout",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error,
    });
    console.log(error);
  }
};

module.exports = {
  userRegister,
  userLogin,
  userLogout,
};
