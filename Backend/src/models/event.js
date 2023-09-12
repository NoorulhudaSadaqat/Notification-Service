const mongoose = require("mongoose");
const EventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is Required"],
  },
  description: {
    type: String,
    required: [true, "Description is Required"],
  },
  applicationId: {
    type: mongoose.Schema.ObjectId,
    ref: "Application",
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
    required: [false],
  },
  createdBy: {
    type: String,
    required: [true, "Created By is Required"],
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
const Event = mongoose.model("Event", EventSchema);

module.exports = Event;
