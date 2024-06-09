import express from "express";
import {
  addToCart,
  applyCoupon,
  clearCart,
  getLoggedCart,
  removeItemCart,
} from "./cart.controller.js";
import { addCartVal, paramsIdVal } from "./cart.validation.js";
import { validation } from "../../middleware/globels/validation.js";
import { protectedRoutes } from "../../middleware/auth/protectedRoutes.js";
import { protectedRoutesCart } from "../../middleware/cart/protectedRoutesCart.js";
import { checkCart } from "../../middleware/cart/checkCart.js";

const cartRouter = express.Router();

cartRouter
  .route("/")
  .post(protectedRoutesCart, validation(addCartVal), checkCart, addToCart)
  .get(protectedRoutesCart, checkCart, getLoggedCart)
  .delete(protectedRoutesCart, checkCart, clearCart);

cartRouter.post("/applycoupon", protectedRoutes, applyCoupon);

cartRouter
  .route("/:id")
  .delete(
    protectedRoutesCart,
    validation(paramsIdVal),
    checkCart,
    removeItemCart
  );

export default cartRouter;
