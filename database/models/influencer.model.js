import mongoose from "mongoose";
import { influencers } from "../../src/assets/enums/influeners.js";

const schema = new mongoose.Schema(
  {
    socialAccounts: { type: String, trim: true, required: true },
    state: {
      type: String,
      enum: Object.values(influencers),
      default: influencers.pending,
    },
    coupon: { type: mongoose.Types.ObjectId, ref: "coupon" },
    influencer: { type: mongoose.Types.ObjectId, ref: "user" },
    createdBy: { type: mongoose.Types.ObjectId, ref: "user" },
    balance: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

// Pre-find hook to automatically populate images field
schema.pre(/^find/, function (next) {
  this.populate({
    path: "influencer",
    model: "user",
  });
  next();
});

export const influencerModel = mongoose.model("influencer", schema);
