import express from "express";
import {
  createCashOrder,
  getAllOrders,
  getSpecificOrder,
} from "./order.controller.js";

import { protectedRoutes } from "../../middleware/auth/protectedRoutes.js";

const orderRouter = express.Router();
orderRouter
  .route("/")
  .get(protectedRoutes, getAllOrders)
  .post(protectedRoutes, createCashOrder);

orderRouter.route("/:id").get(protectedRoutes, getSpecificOrder);

export default orderRouter;
