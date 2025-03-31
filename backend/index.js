const express = require("express");
const dotenv = require("dotenv");
const dbConnect = require("./DB/dbConnect");
const authRouter = require("./routes/authUser");
const messageRouter = require("./routes/messageRouter");
const userRouter = require("./routes/userRouter");
const cookieParser = require("cookie-parser");
const { app, server } = require("./Socket/socket");
const path = require("path");

dotenv.config();

app.use(express.json());
app.use(cookieParser());

dbConnect();

app.use("/api/auth", authRouter);
app.use("/api/message", messageRouter);
app.use("/api/user", userRouter);

if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static(path.join(__dirname, "frontend", "dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running");
  });
}

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Working at ${PORT}`);
});
