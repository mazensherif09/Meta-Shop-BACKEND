import mongoose from "mongoose";
const ObjectId = mongoose.Schema.Types.ObjectId;
const schema = new mongoose.Schema(
  {
    code: {
      type: String,
      unique: [true, "name is required"],
      trim: true,
      required: true,
      minLength: [1, "too short brand name"],
    },
    publish: { type: Boolean, default: false, default: false },
    expires: Date,
    discount: { type: Number, default: 0, required: true, min: 0, max: 100 },
    count: { type: Number, default: 0, required: true, min: 0 },
    createdBy: { type: ObjectId, ref: "user" },
    updatedBy: { type: ObjectId, ref: "user" },
  },
  { timestamps: true }
);

export const couponModel = mongoose.model("coupon", schema);
