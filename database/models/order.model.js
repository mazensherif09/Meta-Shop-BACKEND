import mongoose from "mongoose";
const ObjectId = mongoose.Schema.Types.ObjectId;
const schema = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "user" },
    orderItems: [
      {
        poster: String,
        title: String,
        slug: String,
        selectedOptions: {},
        quantity: {
          type: Number,
          default: 1,
        },
        price: Number,
        product:{ type: mongoose.Types.ObjectId, ref: "product" }
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
// Pre-find hook to automatically populate images field
schema.pre(/^find/, function (next) {
  this.populate({
    path: 'orderItems.product',
    model: 'product'
  })
  next();
});
export const orderModel = mongoose.model("order", schema);
