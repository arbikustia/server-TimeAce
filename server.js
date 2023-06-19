const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const userRouter = require("./App/routes/UserRouter");
const activityRouter = require("./App/routes/activityRouter");

const app = express();
dotenv.config();

const corsOrigin = {
  origin: "*",
};

// register midleware
app.use(cors(corsOrigin));
app.use(express.json());

// connect to database
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err.message);
  });

// create router
app.use("/users", userRouter);
app.use("/activity", activityRouter);

app.get("/", (req, res) => {
  res.send("hello word");
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`server runing on port ${PORT}`));
