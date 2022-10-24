const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Tokens = require("./Tokens");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },

  studentId: {
    type: String,
    required: true,
  },

  tokens: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TokensBought",
    },
  ],
});

UserSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return next();

  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function (candidatePassword) {
  const user = this;
  return new Promise((resolve, reject) => [
    bcrypt.compare(candidatePassword, user.password, (err, isMatched) => {
      if (err) return reject(err);
      if (!isMatched) return reject(false);
      resolve(true);
    }),
  ]);
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
