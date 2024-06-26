import { cartModel } from "../../../database/models/cart.model.js";
import { AppError } from "../../utils/AppError.js";
import { AsyncHandler } from "../globels/AsyncHandler.js";
import jwt from "jsonwebtoken";

export const checkCart = AsyncHandler(async (req, res, next) => {
  let query = req?.user?._id ? { user: req.user._id } : null;
  console.log(req.cookies.cart)
  if (!query) {
    await jwt.verify(
      req.cookie.cart,
      process.env.SECRETKEY,
      async (err, decoded) => {
  
        if (decoded?.cart) {
          query = {
            _id: decoded?.cart,
          };
        }
      }
    );
  }
  let cart = null;
  if (query) {
    cart = await cartModel.findOne(query).populate("items.product");
  }
  if (!cart) {
    cart = new cartModel({
      items: [],
    });
    if (req?.user?._id) {
      cart.user = req?.user?._id;
    } else {
      const TWO_YEARS_IN_MILLISECONDS = 2 * 365 * 24 * 60 * 60 * 1000;
      res.cookie("cart", jwt.sign({ cart: cart._id }, process.env.SECRETKEY), {
        maxAge: TWO_YEARS_IN_MILLISECONDS,
        httpOnly: true, // Prevents client-side JavaScript access
      });
    }
  }
  req.cart = cart;
  return next();
});
