import mongoose from "mongoose";

const logSchema = new mongoose.Schema(
  {
    service: {
      type: String,
      required: true
    },

    level: {
      type: String,
      required: true,
      enum: ["info", "warn", "error"]
    },

    message: {
      type: String,
      required: true
    },

    method: {
      type: String
    },

    endpoint: {
      type: String
    },

    statusCode: {
      type: Number
    }
  },
  {
    timestamps: true
  }
);

const Log = mongoose.model("Log", logSchema);

export default Log;