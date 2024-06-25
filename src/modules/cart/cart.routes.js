import express from "express";
import {
  addToCart,
  applyCoupon,
  clearCart,
  getLoggedCart,
  removeItemCart,
  boundary,
} from "./cart.controller.js";
import { addCartVal, paramsIdVal } from "./cart.validation.js";
import { validation } from "../../middleware/globels/validation.js";
import { protectedRoutesCart } from "../../middleware/cart/protectedRoutesCart.js";
import { checkCart } from "../../middleware/cart/checkCart.js";
const cartRouter = express.Router();
cartRouter
  .route("/")
  .post(protectedRoutesCart, validation(addCartVal), checkCart, addToCart)
  .get(protectedRoutesCart, checkCart, getLoggedCart)
  .patch(protectedRoutesCart, checkCart, clearCart);
cartRouter
  .route("/:id")
  .delete(
    protectedRoutesCart,
    validation(paramsIdVal),
    checkCart,
    removeItemCart
  );

export default cartRouter;
