require("dotenv").config();
const express = require("express");
const connectDB = require("./config");

const app = express();
connectDB();

app.use(express.json());
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use("/api/auth", require("./routes/customerRoute"));
app.use("/api/account", require("./routes/accountRoute"));
app.use("/api/banking", require("./routes/bankingRoute"));
app.use("/api/transactions", require("./routes/transactionRoute"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));