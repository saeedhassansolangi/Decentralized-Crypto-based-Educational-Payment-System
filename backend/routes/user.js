const express = require("express");
const { UserLogin, UserRegister } = require("../controller/user");

const router = express.Router();

// router.get("/", (req, res) => {
//   res.send("hi there    ");
// });

router.post("/login", UserLogin);
router.post("/register", UserRegister);

module.exports = router;
