const User = require("../models/User");
const jwt = require("jsonwebtoken");

const UserLogin = async (req, res) => {
  try {
    const { email: data, password } = req.body;
    const user = await User.findOne({
      $or: [{ email: data }, { username: data }],
    });

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    await user.comparePassword(password);
    const token = jwt.sign(
      {
        userId: user._id,
      },
      "MY_SECRET_KEY"
    );

    const { _id, username, studentId, email } = user;

    return res.send({
      token,
      user: { _id, username, studentId, email },
    });
  } catch (error) {
    return res.status(422).send({
      message: error.message,
    });
  }
};

const UserRegister = async function (req, res) {
  const { email, password, username } = req.body;

  if (!email || !password) return res.send({ message: "not enough data" });
  try {
    // is user already registered with the provided email
    const oldUserWithEmail = await User.find({ email });
    if (oldUserWithEmail && oldUserWithEmail.length > 0) {
      return res.status(422).send({ message: "Email already exists" });
    }

    // is user already registered with the provided username
    const oldUserWithUsername = await User.find({ username });
    if (oldUserWithUsername && oldUserWithUsername.length > 0) {
      return res.status(422).send({ message: "Username already exists" });
    }

    const user = new User({ ...req.body });

    await user.save();
    const token = jwt.sign(
      {
        userId: user._id,
      },
      "MY_SECRET_KEY"
    );

    return res.send({ token });
  } catch (error) {
    return res.status(422).json({
      message: error.message,
    });
  }
};

module.exports = {
  UserLogin,
  UserRegister,
};
