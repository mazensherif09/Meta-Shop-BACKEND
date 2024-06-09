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
schema.pre("save", function (next) {
  this.password = bcrypt.hashSync(this.password, 8);
  next();
});
export const UserModel = mongoose.model("user", schema);
