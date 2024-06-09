import mongoose from "mongoose";
const ObjectId = mongoose.Schema.Types.ObjectId;
const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      unique: [true, "name is required"],
      trim: true,
      required: true,
      minLength: [2, "too short brand name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
      minLength: [2, "too short brand name"],
      required: true,
    },
    price: {
      type: Number,
      min: 0,
      default: 0,
      required: true,
    },
    discount: {
      type: Number,
      min: 0,
      default: 0,
    },
    sold: Number,
    quantity: { type: Number, min: 0, default: 0 },
    rateAvg: { type: Number, min: 0, default: 0 },
    rateCount: { type: Number, min: 0, default: 0 },
    isFeatured: { type: Boolean, default: true },
    puplish: { type: Boolean, default: false, default: false },
    imgcover: { url: String, public_id: String },
    images: [{ url: String, public_id: String }],
    createdBy: { type: ObjectId, ref: "user" },
    subcategory: {
      type: ObjectId,
      ref: "subcategory",
    },
    category: { type: ObjectId, ref: "category" },
    options: [
      {
        name: String,
        stock: { type: Number, default: 0, min: 0 },
      },
    ],
  },
  { timestamps: true }
);

export const productModel = mongoose.model("product", schema);
