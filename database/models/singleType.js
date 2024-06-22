import mongoose from "mongoose";
const ObjectId = mongoose.Schema.Types.ObjectId;

const schema = new mongoose.Schema(
  {
    key: {
      type: String,
      unique: true, // Ensure key is unique
      trim: true,
      required: true,
      minLength: [2, "too short category name"],
    },
    createdBy: { type: mongoose.Types.ObjectId, ref: "user" },
  },
  { timestamps: true }
);

export const SingleTypeModel = mongoose.model("singletype", schema);

// Q&A_Page Schema
const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true,
    minLength: [2, "Question is too short"],
  },
  answer: {
    type: String,
    required: true,
    trim: true,
    minLength: [2, "Answer is too short"],
  },
});
export const questionPageModel = SingleTypeModel.discriminator(
  "question",
  questionSchema
);

// landing_Page Schema
const landingSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: true,
    minLength: [2, "too short brand name"],
  },
  description: {
    type: String,
    trim: true,
    minLength: [2, "too short brand name"],
    required: true,
  },
  sliderLanding: [
    {
      title: {
        type: String,
        trim: true,
        required: true,
        minLength: [2, "too short brand name"],
      },
      description: {
        type: String,
        trim: true,
        minLength: [2, "too short brand name"],
        required: true,
      },
      images: [{ type: ObjectId, ref: "file" }],
    },
  ],

  topCategories: [{ type: ObjectId, ref: "category" }],
});

landingSchema.pre(/^find/, function (next) {
  this.populate({
    path: "topCategories",
    model: "category",
  })
  .populate({
    path: "sliderLanding.images",
    model: "file",
  })
  next();
});

export const landingPageModel = SingleTypeModel.discriminator(
  "landing",
  landingSchema
);

// about_us_Page Schema
const aboutUsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minLength: [2, "Title is too short"],
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minLength: [10, "Description is too short"],
  },
  team: [
    {
      name: {
        type: String,
        trim: true,
        minLength: [2, "Name is too short"],
      },
      position: {
        type: String,
        trim: true,
        minLength: [2, "Position is too short"],
      },
    },
  ],
});
export const aboutPageModel = SingleTypeModel.discriminator(
  "about_us",
  aboutUsSchema
);

// products_Page Schema
const productsPageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minLength: [2, "Title is too short"],
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minLength: [10, "Description is too short"],
  },
});
export const productsPageModel = SingleTypeModel.discriminator(
  "products_page",
  productsPageSchema
);
// warning messages that will be displayed when develment team is upgrading in system
