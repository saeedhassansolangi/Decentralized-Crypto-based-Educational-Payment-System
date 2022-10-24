const express = require("express");
const router = express.Router();

const {
  addUserTokens,
  retreiveUserTokens,
  retriveAllTokens,
  updateTokens,
} = require("../controller/tokens");

router.post("/", addUserTokens);
router.get("/all", retriveAllTokens);
router.get("/:email", retreiveUserTokens);
router.post("/:email/transactionId", updateTokens);

module.exports = router;
