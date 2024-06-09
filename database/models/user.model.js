import mongoose from "mongoose";
import bcrypt from "bcrypt";

const schema = new mongoose.Schema(
  {
    userName: { type: String, trim: true, required: true },
    email: { type: String, trim: true, required: true, unique: true },
    password: { type: String, required: true },
    passwordChangedAt: Date,
    phone: Number,
    pincode: Number,
    isresetPassword: { type: Boolean, default: false },
    roles: [
      { type: mongoose.Types.ObjectId, ref: "user_roles", default: null },
    ],
    confirmEmail: { type: Boolean, default: false },
    isActive: { type: Boolean, default: false },
    isblocked: { type: Boolean, default: false },
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
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }

  // // Set default role if roles array is empty
  // if (this.roles.length === 0) {
  //   const defaultRole = await mongoose.model("user_roles").findOne({ roleName: "user" });
  //   if (defaultRole) {
  //     this.roles = [defaultRole._id];
  //   }
  // }

  next();
});

// Middleware to populate roles field on find queries
const autoPopulateRoles = function (next) {
  this.populate("roles");
  next();
};

schema.pre(/^find/, autoPopulateRoles);

export const UserModel = mongoose.model("user", schema);


