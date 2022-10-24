const express = require("express");
const app = express();
const mongoose = require("mongoose");

const UserRoute = require("./routes/user");
const UserTokensRoute = require("./routes/tokens");
const cors = require("cors");

const URL = `mongodb+srv://saeed:12345saeed@cluster0.ctusi.mongodb.net/edu_pay?retryWrites=true&w=majority`;

mongoose
  .connect(URL, {})
  .then(() => {
    console.log("connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/users", UserRoute);
app.use("/users/tokens", UserTokensRoute);

app.get("/", (req, res) => {
  res.send("Welcome to the payment system backend");
});

app.listen(5000, () => console.log("server is running on the port: 5000"));
