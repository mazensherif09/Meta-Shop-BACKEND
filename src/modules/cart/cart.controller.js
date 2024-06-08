import { cartModel } from "../../../database/models/cart.model.js";
import { productModel } from "../../../database/models/product.model.js";
import { AppError } from "../../utils/AppError.js";
import { couponModel } from "../../../database/models/coupon.model.js";
import { AsyncHandler } from "../../middleware/globels/AsyncHandler.js";

const calcTotalPrice = (cart) => {
  let totalPrice = 0;
  cart.cartItems.forEach((item) => {
    totalPrice += item.quantity * item.price;
  });
  cart.totalPrice = totalPrice;

  if (cart?.discount) {
    let totalPriceAfterDiscount =
      cart.totalPrice - (cart.totalPrice * cart.discount) / 100;
    cart.totalPriceAfterDiscount = totalPriceAfterDiscount;
  }
};

const addToCart = AsyncHandler(async (req, res, next) => {
  let product = await productModel.findById(req?.body?.item?.product);
  if (!product) return next(new AppError("Product not found"));
  let query = {}
  let user= req?.user?._id;
  if (user) {
    query = { user }
  } else if (req.cart) {
    query = { _id: req.cart }
  }
  const cartExist = await cartModel.findOne(query);
  if (!cartExist) {
    if (!req?.user?._id) query = {};
    let cart = new cartModel({
      ...query,
      cartItems: [
        {
          ...req.body,
        },
      ],
    })
    await cart.save();
    if (!cart) return next(new AppError("something went wrong try again later."));
    

    return res.json(cart);
  } else {
    let item = cartExist.cartItems.find(
      (item) => item?.selected_option == req?.body?.item?.selected_option && item?.product == req?.body?.item?.product
    );

    if (item) {
      item.quantity += 1
    } else
      cartExist.cartItems.push({
        ...req.body,
      });

    calcTotalPrice(cartExist);

    await cartExist.save();

    return res.json(cartExist);
  }
});

const removeItemCart = AsyncHandler(async (req, res, next) => {
  let query = {};
  if (req.user._id) {
    query = { user: req.user._id }
  }else {
    query = { _id: req.cart }
  }
  let cart = await cartModel.findOneAndUpdate(
    query, 
    { $pull: { cartItems: { _id: req?.params?.id } } },
    { new: true }
  );
  calcTotalPrice(cart);
  await cart.save();
  if (!cart) return next(new AppError("something went wrong try again later."));
  return res.json(cart);
});

const getLoggedCart = AsyncHandler(async (req, res, next) => {
  let query = {};
  if (req.user._id) {
    query = { user: req.user._id }
  }else {
    query = { _id: req.cart }
  }
  let cart = await cartModel
    .findOne(query)
    .populate("cartItems.product");
    if (!cart) return next(new AppError("something went wrong try again later."));
  return res.json(cart);
});

const clearCart = AsyncHandler(async (req, res, next) => {
  let query = {};
  if (req.user._id) {
    query = { user: req?.user?._id }
  }else {
    query = { _id: req?.cart?._id }
  }
  let cart = await cartModel.findOneAndUpdate(
    query, 
    { cartItems:[] },
    { new: true }
  );
  if (!cart) return next(new AppError("something went wrong try again later."));
  return res.json(cart);
});

const applyCoupon = AsyncHandler(async (req, res, next) => {
  let coupon = await couponModel.findOne({
    code: req.body.coupon,
    expires: { $gte: Date.now() },
  });
  if (!coupon) return next(new AppError("invalid coupon", 401));
  let cart = await cartModel.findOne({ user: req.user._id });
  if (!cart) return next(new AppError("cart not found", 404));
  let totalPriceAfterDiscount =
    cart.totalPrice - (cart.totalPrice * coupon.discount) / 100;
  cart.totalPriceAfterDiscount = totalPriceAfterDiscount;
  cart.discount = coupon.discount;
  await cart.save();
  return res.json({ message: "success", cart });
});

export {
  addToCart,
  removeItemCart,
  getLoggedCart,
  clearCart,
  applyCoupon,
};
