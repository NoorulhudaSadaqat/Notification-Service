const mongoose = require("mongoose");
const MessageSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, "Message is Required"],
  },
  applicationId: {
    type: mongoose.Schema.ObjectId,
    ref: "Application",
    required: true,
  },
  eventId: {
    type: mongoose.Schema.ObjectId,
    ref: "Event",
    required: true,
  },
  notifcationTypeId: {
    type: mongoose.Schema.ObjectId,
    ref: "NotificationType",
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
});
const Message = mongoose.model("Message", MessageSchema);

module.exports = Message;
