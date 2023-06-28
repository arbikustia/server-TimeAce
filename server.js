const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv"); //require dotenv package
dotenv.config({ path: "./config.env" }); //import config.env file
const mongoose = require("mongoose");
const userRouter = require("./App/routes/UserRouter");
const activityRouter = require("./App/routes/ActivityRouter");
const todoListRouter = require("./App/routes/TodoListRouter")

const app = express();

const corsOrigin = {
  origin: "*",
};

// register midleware
app.use(cors(corsOrigin));
app.use(express.json());

// connect to database
const DB = process.env.MONGO_URL || "test";
mongoose
  .connect(DB, {
    usenewurlparser: true,
    useunifiedtopology: true,
  })
  .then(() => {
    console.log("Successfully connected ");
  })
  .catch((error) => {
    console.log(`can not connect to database, ${error}`);
  });

// create router
app.use("/users", userRouter);
app.use("/activity", activityRouter);
app.use("/todolist", todoListRouter);

app.get("/", (req, res) => {
  res.send("TimeAce API");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`server running on port ${PORT}`)
);
