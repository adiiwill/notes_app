const express = require("express");
const app = express();

app.use(express.json());

// Get routes and apply them
const userRoute = require("./routes/User");
const authRoute = require("./routes/Auth");
const noteRoute = require("./routes/Note");

app.use("/user", userRoute);
app.use("/auth", authRoute);
app.use("/note", noteRoute);

app.get("/", (req, res) => {
  res.send("Online");
});

// Run the server
app.listen(8000, () => {
  console.log("The server is running.");
});
