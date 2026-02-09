const mongoose = require("mongoose");

const AppConfigSchema = new mongoose.Schema(
  {
    active: { type: Boolean, default: true, index: true },

    company: {
      name: { type: String, required: true },
      titleLine1: { type: String, required: true },
      titleLine2: { type: String, required: true },

      address1: { type: String, required: true },
      address2: { type: String, required: true },
      postal: { type: String, required: true },

      phone: { type: String, required: true },
      email: { type: String, required: true },

      gstNumber: { type: String, required: true },
      qstNumber: { type: String, required: true },
    },

    taxes: {
      gstRate: { type: Number, required: true }, // 0.05
      qstRate: { type: Number, required: true }, // 0.09975
    },
  },
  { collection: "appconfig", timestamps: true }
);

AppConfigSchema.index({ active: 1, updatedAt: -1 });

module.exports = mongoose.model("AppConfig", AppConfigSchema);
