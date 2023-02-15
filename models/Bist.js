import mongoose from "mongoose";

const bistSchema = mongoose.Schema(
  {
    hisse: {
      type: String,
      required: true,
    },
    fiyat: {
      type: Number,
      required: true,
    },
    change: {
      type: Number,
      required: true,
    },
    isim: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Bist = mongoose.model("Bist", bistSchema);
export default Bist;
