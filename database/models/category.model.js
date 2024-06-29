import mongoose from "mongoose";
import { productModel } from "./product.model.js";

const ObjectId = mongoose.Schema.Types.ObjectId;
const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: [true, "name is required"],
      trim: true,
      required: true,
      minLength: [1, "too short category name"],
    },
    description: {
      type: String,
      trim: true,
      minLength: [1, "too short brand name"],
      required: true,
    },
    slug: {
      type: String,
      lowercase: true,
      required: true,
    },
    poster: { type: ObjectId, ref: "file" },
    createdBy: { type: mongoose.Types.ObjectId, ref: "user" },
    updatedBy: { type: mongoose.Types.ObjectId, ref: "user" },
  },
  { timestamps: true }
);

// Pre-find hook to automatically populate images field
schema.pre(/^find/, function (next) {
  this.populate({
    path: "poster",
    model: "file",
    select: "url",
  });
  next();
});
// Pre-findOneAndDelete hook to remove category references from products
// schema.pre("findByIdAndDelete", async function (next) {
//   try {
//     console.log("hi");
//     const categoryId = this.getQuery()._id;
//     // Remove the category reference from all products
//     await productModel.updateMany(
//       { category: categoryId },
//       { $unset: { category: "" } }
//     );
//     next();
//   } catch (err) {
//     console.log("🚀 ~ err:", err);
//     next();
//   }
// });

export const categoryModel = mongoose.model("category", schema);
