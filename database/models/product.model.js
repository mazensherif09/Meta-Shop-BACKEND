import mongoose from "mongoose";
import { productTypes } from "../../src/assets/enums/productTypes.js";
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
    createdBy: { type: ObjectId, ref: "user" },
    subcategory: { type: ObjectId, ref: "subcategory" },
    category: { type: ObjectId, ref: "category" },
    product_Type: {
      type: String,
      enum: Object.values(productTypes),
    },
  },
  { timestamps: true }
);

// Pre-find hook to automatically populate images field
schema.pre(/^find/, function (next) {
  this.populate({
    path: "colors.color",
    model: "color",
  })
    .populate({
      path: "colors.images",
      model: "file",
    })
    .populate({
      path: "colors.sizes.size",
      model: "size",
    })
    .populate({
      path: "category",
      model: "category",
    });
  next();
});

export const productModel = mongoose.model("product", schema);

// Tech Schema
const DecorSchema = new mongoose.Schema({
  colors: [
    {
      color: { type: ObjectId, ref: "color" },
      images: [{ type: ObjectId, ref: "file" }],
      stock:{type:Number, min:0, default:0 }
    },
  ],
});

// Pre-find hook to automatically populate images field
DecorSchema.pre(/^find/, function (next) {
  this.populate({
    path: "colors.color",
    model: "color",
  }).populate({
    path: "colors.images",
    model: "file",
  });
  next();
});

export const DecorModel = productModel.discriminator("decor", DecorSchema);

// Clothes Schema
const clothesSchema = new mongoose.Schema({
  colors: [
    {
      color: { type: ObjectId, ref: "color" },
      images: [{ type: ObjectId, ref: "file" }],
      sizes: [
        {
          size: { type: ObjectId, ref: "size" },
          stock: { type: Number, default: 0, min: 0 },
        },
      ],
    },
  ],
});

// Pre-find hook to automatically populate images field
clothesSchema.pre(/^find/, function (next) {
  this.populate({
    path: "colors.color",
    model: "color",
  })
    .populate({
      path: "colors.images",
      model: "file",
    })
    .populate({
      path: "colors.sizes.size",
      model: "size",
    });
  next();
});

export const ClothesModel = productModel.discriminator(
  "clothes",
  clothesSchema
);



