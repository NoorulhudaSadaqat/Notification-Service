const mongoose = require("mongoose");
const ApplicationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is Required"],
  },
  description: {
    type: String,
    required: [true, "Description is Required"],
  },
  code: {
    type: String,
    required: [true, "Code is Required"],
  },
  isActive: {
    type: Boolean,
    default: true,
    required: [false],
  },
  createdBy: {
    type: String,
    required: [true, "Created by is Required"],
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
const Application = mongoose.model("Application", ApplicationSchema);

module.exports = Application;
