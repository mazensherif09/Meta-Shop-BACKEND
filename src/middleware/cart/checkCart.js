import { cartModel } from "../../../database/models/cart.model.js";
import { AsyncHandler } from "../globels/AsyncHandler.js";

export const checkCart = AsyncHandler(async (req, res, next) => {
  let query = req?.user?._id
  ? { user: req?.user?._id }
  : req?.cookies?.cart
  ? { _id: req?.cookies?.cart }
  : null;
  let cart = null;
  if (query) {
      cart = await cartModel.findOne(query).populate("items.product");
      }
  if (!cart) {
    cart = new cartModel({
        Items: [],
    });
    if (req?.user?._id) {
      cart.user = req?.user?._id;
    } else {
      const TWO_YEARS_IN_MILLISECONDS = 2 * 365 * 24 * 60 * 60 * 1000;
      res.cookie("cart", cart?._id, {
        maxAge: TWO_YEARS_IN_MILLISECONDS,
        httpOnly: true, // Prevents client-side JavaScript access
      });
    }
  }
  req.cart = cart;
  return next();
});
