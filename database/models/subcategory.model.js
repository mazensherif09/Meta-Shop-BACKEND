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
    description: {
      type: String,
      trim: true,
      minLength: [2, "too short brand name"],
      required: true,
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

// Pre-find hook to automatically populate images field
schema.pre(/^find/, function (next) {
  this.populate({
      path: "category",
      model: "category",
    }) 
     .populate({
      path: 'poster',
      model: 'file',
      select: 'url',
    });
  next();
});

export const SubCategoryModel = mongoose.model("subcategory", schema);
