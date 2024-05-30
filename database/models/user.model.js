import mongoose from "mongoose";
import bcrypt from "bcrypt";

const schema = new mongoose.Schema(
  {
    userName: { type: String, trim: true, required: true },
    email: { type: String, trim: true, required: true, unique: true },
    password: { type: String, required: true },
    phone: Number,
    Pincode: Number,
    isresetPassword: { type: Boolean, default: false },
    role: {
      type: String,
      enum: [
        "user", // normal user | customer
        "vendor", // vendor can create/Edit [products] => Which he owns !
        "designer", // the designer can control on media [landing page , swipers media , etc...]
        "super_admin", // The main admin
        "Owner_brand", // brand-Owner can create/Edit [products , brands] => Which he owns !
        "Order_Handler", // The employee who handles review details orders => loaction , choose Who will deliver the order
        "representatives", // The employee who delivers orders
      ],
      default: "user",
    },
    confirmEmail: { type: Boolean, default: false },
    isActive: { type: Boolean, default: false },
    isblocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);
schema.pre("save", function (next) {
  this.password = bcrypt.hashSync(this.password, 8);
  next();
});
export const UserModel = mongoose.model("user", schema);
