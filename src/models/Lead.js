const mongoose = require("mongoose");

const allowedStatuses = ["NEW", "CONTACTED", "QUALIFIED", "CONVERTED", "LOST"];

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
      trim: true,
    },
    source: {
      type: String,
      required: [true, "Source is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: allowedStatuses,
      default: "NEW",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Lead = mongoose.model("Lead", leadSchema);

module.exports = {
  Lead,
  allowedStatuses,
};
