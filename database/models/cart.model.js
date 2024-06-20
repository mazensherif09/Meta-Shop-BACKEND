import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "user" },
    items: [
      {
        product: { type: mongoose.Types.ObjectId, ref: "product" },
        selectedOptionId: String,
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    totalPrice: Number,
    totalPriceAfterDiscount: Number,
    discount: Number,
  },
  { timestamps: true }
);

export const cartModel = mongoose.model("cart", schema);
