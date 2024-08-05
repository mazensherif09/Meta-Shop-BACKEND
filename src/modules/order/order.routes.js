import express from "express";
import {
  createOrder,
  getAllOrders,
  getSpecificOrder,
} from "./order.controller.js";

import { protectedRoutes } from "../../middleware/auth/protectedRoutes.js";
import { makeOrder } from "../../middleware/orders/makeOrder.js";

const orderRouter = express.Router();
orderRouter
  .route("/")
  .get(protectedRoutes, getAllOrders)
  .post(protectedRoutes, makeOrder, createOrder);

orderRouter.route("/:id").get(protectedRoutes, getSpecificOrder);

export default orderRouter;
