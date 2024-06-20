import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;
const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: [true, "name is required"],
      trim: true,
      required: true,
      minLength: [2, "too short category name"],
    },
    slug: {
      type: String,
      lowercase: true,
      required: true,
    },
    poster: { type: ObjectId, ref: "file" },
    category: { type: ObjectId, ref: "category" },
    createdBy: { type: ObjectId, ref: "user" },
  },
  { timestamps: true }
);

export const SubCategoryModel = mongoose.model("subcategory", schema);
