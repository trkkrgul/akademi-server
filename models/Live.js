import mongoose from "mongoose";

const liveSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    liveLink: {
      type: String,
      required: true,
    },
    coverPhoto: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

const Live = mongoose.model("Live", liveSchema);
export default Live;
