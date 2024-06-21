import mongoose from "mongoose";
import { influencers } from "../../src/assets/enums/influeners";

const schema = new mongoose.Schema(
  {
    state: {
      type: String,
      enum: Object.values(influencers),
      default: influencers.pending,
    },
    coupon: { type: mongoose.Types.ObjectId, ref: "coupon" },
    influencer: { type: mongoose.Types.ObjectId, ref: "user" },
    createdBy: { type: mongoose.Types.ObjectId, ref: "user" },
    count: {
      type: Number,
      default: 0,
      min: 0,
    },
    balance: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

export const couponModel = mongoose.model("influencer", schema);
