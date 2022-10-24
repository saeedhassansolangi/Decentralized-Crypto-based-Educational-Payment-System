const User = require("../models/User");
const Tokens = require("../models/Tokens");

const addUserTokens = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: "user not found" });
    }

    try {
      const newToken = await Tokens({ ...req.body });
      await newToken.save();
      user.tokens.unshift(newToken);
      await user.save();

      return res.status(201).json({
        message: "Token Added",
      });
    } catch (error) {
      return res.json({ error });
    }
  } catch (e) {
    res.status(500).send();
  }
};

const retreiveUserTokens = async (req, res) => {
  const { email } = req.params;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    Tokens.find({}, (err, tokens) => {
      if (err) return res.status(404).send({ message: err.message });
      return res.send(tokens);
    });
  } catch (e) {
    res.status(500).send();
  }
};

const retriveAllTokens = (req, res) => {
  Tokens.find({}, (err, tokens) => {
    if (err) return res.json({ err });
    return res.send(tokens);
  });
};

// router.post("/:email/transactionId", updateTokens);
const updateTokens = async (req, res) => {
  const { email } = req.params;
  const { transactionId } = req.body;

  console.log({
    email,
    transactionId,
  });
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: "Something went wrong" });
    }

    const token = await Tokens.findOne({ transactionId });
    if (!token) {
      return res.status(404).send({ message: "Something went wrong" });
    }

    token.hasRecived = true;
    await token.save();

    return res.status(201).json({
      message: "Token Updated",
    });
  } catch (e) {
    res.status(500).send({
      message: e.message,
    });
  }
};

module.exports = {
  addUserTokens,
  retreiveUserTokens,
  retriveAllTokens,
  updateTokens,
};
