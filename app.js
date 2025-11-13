const express = require("express");
const app = express();
const connectDB = require("./db/connect");
require("dotenv").config();
const port = process.env.PORT || 5000;

const tasksRoutes = require("./routes/tasks");
// basic get route

app.use(express.json());
app.get("/hello", (req, res) => {
  res.send(" HII From First Project");
});

app.use("/api/v1/tasks", tasksRoutes);

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
