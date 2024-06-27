import mongoose from "mongoose";
import { influencers } from "../../src/assets/enums/influeners.js";
const ObjectId = mongoose.Schema.Types.ObjectId;
const schema = new mongoose.Schema(
  {
    socialAccount: { type: String, trim: true, required: true },
    state: {
      type: String,
      enum: Object.values(influencers),
      default: influencers.pending,
    },
    coupon: { type: mongoose.Types.ObjectId, ref: "coupon" },
    relatedTo: { type: mongoose.Types.ObjectId, ref: "user" },
    createdBy: { type: mongoose.Types.ObjectId, ref: "user" },
    balance: {
      type: Number,
      default: 0,
      min: 0,
    },
    updatedBy: { type: mongoose.Types.ObjectId, ref: "user" },
  },
  { timestamps: true }
);

// // Pre-find hook to automatically populate images field
schema.pre(/^find/, function (next) {
  this.populate({
    path: 'relatedTo',
    select: '_id fullName'
  })
  this.populate({
    path: 'coupon',
    select: '_id code'
  })
  next();
});

export const influencerModel = mongoose.model("influencer", schema);
