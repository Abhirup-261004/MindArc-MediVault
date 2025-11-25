const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: { type: String, required: true },
    type: { type: String, required: true },
    specialty: { type: String, required: true },
    date: { type: String, required: true },
    doctor: { type: String, default: "" },

    fileUrl: { type: String, required: true }, // uploaded file path
  },
  { timestamps: true }
);

module.exports = mongoose.model("Prescription", prescriptionSchema);
