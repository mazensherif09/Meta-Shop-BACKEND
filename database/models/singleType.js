import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    key: {
      type: String,
      unique: [true, "name is required"],
      trim: true,
      required: true,
      minLength: [2, "too short category name"],
    },
    attrbutes: {},
    createdBy: { type: mongoose.Types.ObjectId, ref: "user" },
  },
  { timestamps: true }
);

export const SingleTypeModel = mongoose.model("singletype", schema);

// cases

// pages data [landing, products, about us, Q&A]

// warning messages that will be displayed when develment team is upgrading in system
