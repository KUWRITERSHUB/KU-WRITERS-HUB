console.log("SERVER STARTING...");

const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("M-PESA Server Running ✅");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on " + PORT));
