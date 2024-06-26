import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { enumRoles } from "../../src/assets/enums/Roles_permissions.js";

const schema = new mongoose.Schema(
  {
    fullName: { type: String, trim: true, required: true },
    email: { type: String, trim: true, required: true, unique: true },
    password: { type: String, required: true },
    passwordChangedAt: Date,
    phone: Number,
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


// Middleware to populate influencer field on find queries
const autoPopulateInfluencer = function (next) {
  this.populate("influencer");
  next();
};

schema.pre(/^find/, autoPopulateInfluencer);


export const UserModel = mongoose.model("user", schema);
