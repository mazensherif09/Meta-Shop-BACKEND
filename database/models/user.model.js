import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { enumRoles } from "../../src/assets/enums/Roles_permissions.js";

const schema = new mongoose.Schema(
  {
    fullName: { type: String, trim: true, required: true },
    email: { type: String, trim: true, required: true, unique: true },
    password: { type: String, required: true },
    passwordChangedAt: Date,
    phone: { type: String, trim: true },
    pincode: Number,
    isresetPassword: { type: Boolean, default: false },
    // roles:  { type: mongoose.Types.ObjectId, ref: "user_roles", default: null },
    role: {
      type: String,
      enum: [...Object.values(enumRoles)],
      default: enumRoles?.user,
    },
    confirmEmail: { type: Boolean, default: false },
    isActive: { type: Boolean, default: false },
    isblocked: { type: Boolean, default: false },
    influencer: { type: mongoose.Types.ObjectId, ref: "influencer" },
    createdBy: { type: mongoose.Types.ObjectId, ref: "user" },
    updatedBy: { type: mongoose.Types.ObjectId, ref: "user" },
    addresses: [
      {
        street: String,
        phone: String,
        city: String,
      },
    ],
  },
  { timestamps: true }
);

schema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 8);
  next();
});

// Middleware to exclude password field from all find queries
const excludePassword = function (next) {
  this.select("-password");
  next();
};

// Middleware to populate related fields on find queries
const autoPopulateFields = function (next) {
  this.populate("influencer")
    .populate({
      path: "createdBy",
      select: "fullName _id",
    })
    .populate({
      path: "updatedBy",
      select: "fullName _id",
    });
  next();
};

schema.pre(/^find/, excludePassword);
schema.pre(/^find/, autoPopulateFields);

export const UserModel = mongoose.model("user", schema);
