import express from "express";
import {
  couponSchemaVal,
  updateCouponSchemaVal,
  paramsIdVal,
} from "./coupon.validation.js";
import { validation } from "../../middleware/globels/validation.js";
import { addCoupon, getCoupon, deleteCoupon, updateCoupon, checkCoupon } from "./coupon.controller.js";

import { protectedRoutes } from "../../middleware/auth/protectedRoutes.js";

const couponRouter = express.Router();

couponRouter
  .route("/")
  .post(validation(couponSchemaVal), addCoupon)
  .get(getCoupon);

  couponRouter.get("/validate-coupon", checkCoupon)

couponRouter
  .route("/:id")
  .put(validation(updateCouponSchemaVal), updateCoupon)
  .delete(validation(paramsIdVal), deleteCoupon);

export default couponRouter;
