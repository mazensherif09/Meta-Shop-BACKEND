import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    text: {
      type: String,
      unique: [true, "name is required"],
      trim: true,
      required: true,
      minLength: [2, "too short brand name"],
    },
    expires: Date,
    discount: { type: Number, default: 0, required: true, min: 1, max: 100 },
    percentage: { type: Number, default: 0, required: true, min: 1, max: 100 },
    createdBy: { type: mongoose.Types.ObjectId, ref: "user" },
    relatedTo: { type: mongoose.Types.ObjectId, ref: "user" },
  },
  { timestamps: true }
);

export const couponModel = mongoose.model("coupon", schema);
