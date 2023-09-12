const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First Name is Required"],
  },
  lastName: {
    type: String,
    required: [true, "Last Name is Required"],
  },
  email: {
    type: String,
    required: [true, "Email is Required"],
  },
  password: {
    type: String,
    required: [true, "Password is Required"],
  },
  isActive: {
    type: Boolean,
    default: true,
    required: [false],
  },
});
const User = mongoose.model("User", UserSchema);

module.exports = User;
