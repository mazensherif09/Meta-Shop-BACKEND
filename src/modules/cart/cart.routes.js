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
import { checkCart } from "../../middleware/cart/checkCart.js";
import { protectedRoutes } from "../../middleware/auth/protectedRoutes.js";
const cartRouter = express.Router();
cartRouter
  .route("/")
  .post(protectedRoutes, validation(addCartVal), checkCart, addToCart)
  .get(protectedRoutes, checkCart, getLoggedCart)
  .delete(protectedRoutes, checkCart, clearCart);
cartRouter
  .route("/:id")
  .delete(
    protectedRoutes,
    validation(paramsIdVal),
    checkCart,
    removeItemCart
  );

export default cartRouter;
