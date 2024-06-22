import express from "express";
import {
  couponSchemaVal,
  updateCouponSchemaVal,
  paramsIdVal,
} from "./coupon.validation.js";
import { validation } from "../../middleware/globels/validation.js";
import { Insert, GetAll, Delete, Update, checkCoupon, getOne } from "./coupon.controller.js";

import { protectedRoutes } from "../../middleware/auth/protectedRoutes.js";

const couponRouter = express.Router();

couponRouter
  .route("/")
  .post(validation(couponSchemaVal), Insert)
  .get(GetAll);

  couponRouter.get("/validate-coupon", checkCoupon)

couponRouter
  .route("/:id")
  .get(getOne)
  .put(validation(updateCouponSchemaVal), Update)
  .delete(validation(paramsIdVal), Delete);

export default couponRouter;
