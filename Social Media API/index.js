const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv");
dotenv.config();
app.listen(5000, () => console.log(`listening on port 5000....`));

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });

const connection = mongoose.connection;
connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
});
process.on("SIGINT", () => {
  connection.close(() => {
    console.log("Mongoose connection disconnected through app termination");
    process.exit(0);
  });
});

const handler = require("./middlewares/errorHandler");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const authRoute = require("./routes/auth");
const commentRoute = require("./routes/comments");

//const checkToken = require("./middlewares/checkTokens");
// middlewares

app.use(express.json());
//app.use(handler());
app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  })
);
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ error: "Something went wrong" });
// });
app.use(cookieParser());
app.use(morgan("common"));
// app.use(checkToken());
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/auth", authRoute);
app.use("/api/comments", commentRoute);

// error handling middleware
app.use(handler);
