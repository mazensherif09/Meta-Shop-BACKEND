import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "user" },
    tems: [
      {
        product: { type: mongoose.Types.ObjectId, ref: "product" },
        quantity: {
          type: Number,
          default: 1,
        },
        selected_option: String,
      },
    ],
    totalPrice: Number,
    totalPriceAfterDiscount: Number,
    discount: Number,
  },
  { timestamps: true }
);

export const cartModel = mongoose.model("cart", schema);
