import mongoose from "mongoose";
const ObjectId = mongoose.Schema.Types.ObjectId;

const schema = new mongoose.Schema(
  {
    key: {
      type: String,
      unique: true, // Ensure key is unique
      trim: true,
      required: true,
      minLength: [1, "too short category name"],
    },
    createdBy: { type: mongoose.Types.ObjectId, ref: "user" },
    updatedBy: { type: mongoose.Types.ObjectId, ref: "user" },
  },
  { timestamps: true }
);
schema.pre(/^find/, function (next) {
  this.populate({
    path: "topCategories",
    model: "category",
    select: "_id name poster", // Example fields to select from the 'color' model
    options: { strictPopulate: false }, // Disable strictPopulate for this path if needed
  }).populate({
    path: "sliderLanding.poster",
    model: "file",
    select: "_id url", // Example fields to select from the 'color' model
    options: { strictPopulate: false }, // Disable strictPopulate for this path if needed
  });
  next();
});
export const SingleTypeModel = mongoose.model("singletype", schema);

// Q&A_Page Schema
const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true,
    minLength: [1, "Question is too short"],
  },
  answer: {
    type: String,
    required: true,
    trim: true,
    minLength: [1, "Answer is too short"],
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
    minLength: [1, "too short brand name"],
  },
  description: {
    type: String,
    trim: true,
    minLength: [1, "too short brand name"],
    required: true,
  },
  sliderLanding: [
    {
      title: {
        type: String,
        trim: true,
        required: true,
        minLength: [1, "too short brand name"],
      },
      description: {
        type: String,
        trim: true,
        minLength: [1, "too short brand name"],
        required: true,
      },
      poster: { type: ObjectId, ref: "file" },
    },
  ],
  topCategories: [{ type: ObjectId, ref: "category" }],
  newInPoster: { type: ObjectId, ref: "file" },
  newInTitle: {
    type: String,
    trim: true,
    minLength: [1, "too short brand name"],
    required: true,
  },
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
    minLength: [1, "Title is too short"],
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
        minLength: [1, "Name is too short"],
      },
      position: {
        type: String,
        trim: true,
        minLength: [1, "Position is too short"],
      },
    },
  ],
});
export const aboutPageModel = SingleTypeModel.discriminator(
  "about_us",
  aboutUsSchema
);

// products_Page Schema
const warningSchema = new mongoose.Schema({
  publish: {
    type: Boolean,
    required: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: Date,
    required: true,
  },
});
export const warningPageModel = SingleTypeModel.discriminator(
  "warning",
  warningSchema
);
// warning messages that will be displayed when develment team is upgrading in system
