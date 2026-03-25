const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("UK Writers Hub Backend is running ✅");
});

app.post("/pay", (req, res) => {
  const phone = req.body.phone;
  console.log("Phone:", phone);

  res.json({ message: "STK Push will be sent here" });
});

app.listen(3000, () => console.log("Server running"));
