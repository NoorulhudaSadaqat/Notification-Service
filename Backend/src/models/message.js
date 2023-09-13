const mongoose = require("mongoose");
const MessageSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, "Message is Required"],
  },
  applicationId: {
    type: String,
    required: [true, "applicationId is Required"],
  },
  eventId: {
    type: String,
    required: [true, "eventId is Required"],
  },
  notificationTypeId: {
    type: String,
    required: [true, "notificationTypeId is Required"],
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
