import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    code: {
      type: String,
      unique: [true, "name is required"],
      trim: true,
      required: true,
      minLength: [2, "too short brand name"],
    },
    expires: Date,
    discount: { type: Number, default: 0, required: true, min: 0, max: 100 },
    count: { type: Number, default: 0, required: true, min: 0 },
    createdBy: { type: mongoose.Types.ObjectId, ref: "user" },
    updatedBy: { type: mongoose.Types.ObjectId, ref: "user" },
    relatedTo: { type: mongoose.Types.ObjectId, ref: "user" },
  },
  { timestamps: true }
);
// handle pre populate

export const couponModel = mongoose.model("coupon", schema);
