const mongoose = require("mongoose");
const TagSchema = new mongoose.Schema({
  label: {
    type: String,
    required: [true, "Label is Required"],
  },
  isActive: {
    type: Boolean,
    default: true,
    required: [false],
  },
  createdBy: {
    type: String,
    required: [true, "Password is Required"],
  },
  modifiedBy: {
    type: String,
    required: [false],
  },
  createdDate: {
    type: Date,
    required: [true, "Created Date is Required"],
  },
  modifiedDate: {
    type: Date,
    required: [false],
  },
});
const Tag = mongoose.model("Tag", TagSchema);

module.exports = Tag;
