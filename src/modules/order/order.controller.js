import { cartModel } from "../../../database/models/cart.model.js";
import { orderModel } from "../../../database/models/order.model.js";
import { productModel } from "../../../database/models/product.model.js";
import { AsyncHandler } from "../../middleware/AsyncHandler.js";
import { AppError } from "../../utils/AppError.js";
import Stripe from "stripe";

const stripe = new Stripe('sk_test....');

const createCashOrder = AsyncHandler(async (req, res, next) => {
  //1- get cart --> cartId
  let cart = await cartModel.findById(req.params.id);
  if (!cart) return next(new AppError("cart not found"));
  //2- total order price
  let totalOrderPrice = cart?.totalPriceAfterDiscount
    ? cart?.totalPriceAfterDisc
    : cart?.totalPrice;
  //3- create order --> cash
  let order = new orderModel({
    user: req.user._id,
    orderItems: cart.cartItems,
    shippingAddress: req.body.shippingAddress,
    totalOrderPrice,
  });
  await order.save();
  //4- increment sold && decrement Qty
  let options = cart.cartItems.map((prod) => {
    return {
      updateOne: {
        filter: { _id: prod.product },
        update: { $inc: { sold: prod.quantity, quantity: -prod.quantity } },
      },
    };
  });
  await productModel.bulkWrite(options);
  //5- clear cart
  await cartModel.findByIdAndDelete(req.params.id);

  res.json({ message: "success", order });
});

const getSpecificOrder = AsyncHandler(async (req, res, next) => {
  //1- get order --> user Id
  let order = await orderModel
    .findOne({ user: req.user._id })
    .populate("orderItems.product");
  if (!order) return next(new AppError("order not found"));

  res.json({ message: "success", order });
});

const getAllOrders = AsyncHandler(async (req, res, next) => {
  //1- get cart --> cartId
  let orders = await orderModel.find().populate("orderItems.product");
  if (!orders) return next(new AppError("order not found"));

  res.json({ message: "success", orders });
});

const createCheckoutSession = AsyncHandler(async (req, res, next) => {
  //1- get cart --> cartId
  let cart = await cartModel.findById(req.params.id);
  if (!cart) return next(new AppError("cart not found"));
  //2- total order price
  let totalOrderPrice = cart?.totalPriceAfterDiscount
  ? cart?.totalPriceAfterDisc
  : cart?.totalPrice;
  //3- create session for the payment transaction
  let session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "egp",
          unit_amount: totalOrderPrice * 100,
          product_data: {
            name: req.user.name,
          },
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: "https://route-comm.netlify.app/#/", // to home page or orders page
    cancel_url: "https://route-comm.netlify.app/#/cart", // to cart
    customer_email: req.user.email,
    client_reference_id: req.params.id,
    metadata: req.body.shippingAddress,
  });
  res.json({ message: "success", session });
});

export {
  createCashOrder,
  getSpecificOrder,
  getAllOrders,
  createCheckoutSession,
};
