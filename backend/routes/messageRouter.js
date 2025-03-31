const express = require("express");
const {
  sendMessage,
  getMessages,
} = require("../controllers/messageController");
const isLogin = require("../middleware/isLogin");

const messageRouter = express.Router();

messageRouter.post("/send/:id", isLogin, sendMessage);

messageRouter.get("/:id", isLogin, getMessages);

module.exports = messageRouter;
