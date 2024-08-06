import mongoose, { Schema } from "mongoose";

export const ObjectId = mongoose.Schema.Types.ObjectId;
const orderItemSchema = new Schema({
  original_id: { type: ObjectId, ref: "product" },
  name: String,
  price: { type: Number, min: 0, default: 0 }, // Price at the time of ordering
  discount: { type: Number },
  quantity: { type: Number, default: 1, min: 1 },
  poster: String,
  selectedOptions: {},
});
const couponSchema = new Schema({
  code: { type: String, required: true },
  discount: { type: Number, required: true },
  original_id: { type: ObjectId, ref: "coupon", required: true },
});
const schema = new Schema(
  {
    user: { type: ObjectId, ref: "user", required: true },
    orderItems: [orderItemSchema],
    totalOrderPrice: { type: Number, min: 0, default: 0, required: true },
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      phone: { type: String, required: true },
    },
    paymentType: {
      type: String,
      enum: ["cash", "visa"],
      default: "cash",
    },
    orderStatus: {
      type: String,
      enum: ["pending", "accepted", "delivered", "canceled"],
      default: "pending",
    },
    isRefunded: {
      type: Boolean,
      default: false,
    },
    deliveredAt: Date,
    paidAt: Date,
    updatedBy: { type: mongoose.Types.ObjectId, ref: "user" },
    createdBy: { type: mongoose.Types.ObjectId, ref: "user" },
    discount: { type: Number, min: 0, max: 100, default: 0 },
    coupon: couponSchema,
  },
  { timestamps: true }
);
export const orderModel = mongoose.model("order", schema);
