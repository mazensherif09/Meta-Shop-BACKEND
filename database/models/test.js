import mongoose from "mongoose";
const ObjectId = mongoose.Schema.Types.ObjectId;

// Base Product Schema
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: ObjectId, ref: "category" },
    brand: { type: String },
    description: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  // { discriminatorKey: "category", collection: "productstest" }
);

export const ProductTestModel = mongoose.model("Producttest", productSchema);

// File Schema
const fileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  filepath: { type: String, required: true },
  mimetype: { type: String, required: true },
  size: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const FileTestModel = mongoose.model("Filetest", fileSchema);

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
  this.populate("images");
  next();
});

export const ClothesTestModel = ProductTestModel.discriminator(
  "clothestest",
  clothesSchema
);

// Tech Schema
const techSchema = new mongoose.Schema({
  specs: {
    processor: { type: String },
    ram: { type: String },
    storage: { type: String },
  },
  colors: { type: [String] },
});

export const TechTestModel = ProductTestModel.discriminator(
  "techtest",
  techSchema
);

// CRUD Routes
