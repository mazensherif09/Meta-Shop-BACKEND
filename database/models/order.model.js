import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "user" },
    orderItems: [
      {
        product: {},
        quantity: {
          type: Number,
          default: 1,
        },
        selectedOptionId: String,
      },
    ],
    totalOrderPrice: Number,
    shippingAddress: {
      street: String,
      city: String,
      phone: String,
    },
    paymentType: {
      type: String,
      enum: ["card", "cash"],
      default: "cash",
    },
    isDelivered: {
      type: Boolean,
      default: false,
    },
    deliveredAt: Date,
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: Date,
  },
  { timestamps: true }
);

export const orderModel = mongoose.model("order", schema);
