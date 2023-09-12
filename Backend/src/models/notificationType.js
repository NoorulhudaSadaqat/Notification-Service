const mongoose = require("mongoose");
const NotificationTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is Required"],
  },
  description: {
    type: String,
    required: [true, "Description is Required"],
  },
  templateSubject: {
    type: String,
    required: [true, "Template Subject is Required"],
  },
  templateBody: {
    type: String,
    required: [true, "Template Body is Required"],
  },
  eventId: {
    type: mongoose.Schema.ObjectId,
    ref: "Event",
    required: true,
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
  tags: {
    type: [String],
    required: [true, "tags are Required"],
  },
});

const NotificationType = mongoose.model(
  "NotificationType",
  NotificationTypeSchema
);

module.exports = NotificationType;
