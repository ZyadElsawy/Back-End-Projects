const express = require("express");
const app = express();
const connectDB = require("./db/connect");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const port = process.env.PORT || 5000;

const tasksRoutes = require("./routes/tasks");
const authRoutes = require("./routes/auth");
const errorHandler = require("./middlewares/error-handler");

app.use(express.static("./public"));
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/tasks", tasksRoutes);
app.use("/api/v1/auth", authRoutes);

app.use(errorHandler);

const start = async () => {
  try {
    await connectDB();
    app.listen(process.env.PORT, () => {
      console.log(`Server is listening on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
