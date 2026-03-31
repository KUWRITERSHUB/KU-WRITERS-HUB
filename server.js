const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server running ✅");
});

app.post("/stk", (req, res) => {
  const { phone, amount } = req.body;

  console.log("STK Request:", phone, amount);

  res.json({
    success: true,
    message: "STK Push sent"
  });
});

app.listen(3000, () => console.log("Server running on port 3000"));
