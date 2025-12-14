const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  roleName: {
    type: String,
    required: true,
  },
  vacancies: {
    type: Number,
    required: true,
  },
  applicants: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      status: {
        type: String,
        enum: ["applied", "selected", "rejected"],
        default: "applied",
      },
      appliedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const serviceSchema = new mongoose.Schema(
  {
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true, // Wedding Service
    },
    description: {
      type: String,
      required: true,
    },
    budget: {
      type: Number,
    },
    location: {
      type: String,
    },
    roles: [roleSchema], // Cook, Caterer, etc.
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", serviceSchema);
