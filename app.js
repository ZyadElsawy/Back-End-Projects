const express = require("express");
const app = express();

const port = 3000;

const tasksRoutes = require("./routes/tasks");
// basic get route

app.use(express.json());
app.get("/hello", (req, res) => {
  res.send(" HII From First Project");
});

app.use("/api/v1/tasks", tasksRoutes);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}...`);
});
