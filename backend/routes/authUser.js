const express = require("express");
const {
  userRegister,
  userLogin,
  userLogout,
} = require("../controllers/userController");

const authRouter = express.Router();

authRouter.post("/register", userRegister);

authRouter.post("/login", userLogin);

authRouter.post("/logout", userLogout);

module.exports = authRouter;
