import mongoose from "mongoose";

// Base Product Schema
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    brand: { type: String },
    description: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { discriminatorKey: "category", collection: "products" }
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

export const FileTestModel = mongoose.model("File", fileSchema);

// Clothes Schema
const clothesSchema = new mongoose.Schema({
  size: { type: String, required: true },
  color: { type: [String], required: true },
  images: [{ type: mongoose.Schema.Types.ObjectId, ref: "File" }], // Array of File references
});

// Pre-find hook to automatically populate images field
clothesSchema.pre(/^find/, function (next) {
  this.populate("images");
  next();
});

export const ClothesTestModel = ProductTestModel.discriminator("clothestest", clothesSchema);

// Tech Schema
const techSchema = new mongoose.Schema({
  specs: {
    processor: { type: String },
    ram: { type: String },
    storage: { type: String },
  },
  colors: { type: [String] },
});

export const TechTestModel = ProductTestModel.discriminator("techtest", techSchema);

// CRUD Routes
