const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username wajib diisi"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password wajib diisi"],
    },
    role: {
      type: String,
      enum: ["user", "admin", "staff"],
      default: "user",
      set: (value) => String(value).toLowerCase(),
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
