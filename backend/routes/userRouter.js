const express = require("express");
const isLogin = require("../middleware/isLogin");
const {
  getUserBySearch,
  getCurrentChatters,
} = require("../controllers/userSearchController");

const userRouter = express.Router();

userRouter.get("/search", isLogin, getUserBySearch);

userRouter.get("/currentchatters", isLogin, getCurrentChatters);

module.exports = userRouter;
