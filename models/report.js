const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: { type: String, required: true },
    type: { type: String, required: true },
    category: { type: String, required: true },
    date: { type: String, required: true },
    doctor: { type: String, default: "" },

    fileUrl: { type: String, required: true },  // stored path to uploaded file
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);
