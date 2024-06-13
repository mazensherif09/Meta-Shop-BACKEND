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
    isFeatured: { type: Boolean, default: true },
    puplish: { type: Boolean, default: false, default: false },
    imgcover: { url: String, public_id: String },
    createdBy: { type: ObjectId, ref: "user" },
    subcategory: {
      type: ObjectId,
      ref: "subcategory",
    },
    category: { type: ObjectId, ref: "category" },
    colors: [
      {
        name: { type: String, default: "non-color" },
        code: { type: String, default: null },
        images: [{ type: ObjectId, ref: "files" },
        ],
        sizes: [
          {
            size: { type: ObjectId, ref: "size" },
            stock: { type: Number, default: 0, min: 0 },
          },
        ]
      },
    ],
  },
  { timestamps: true }
);

export const productModel = mongoose.model("product", schema);
