import express from "express";
import {
  couponSchemaVal,
  updateCouponSchemaVal,
  paramsIdVal,
} from "./coupon.validation.js";
import { validation } from "../../middleware/globels/validation.js";
import {
  Insert,
  GetAll,
  Delete,
  Update,
  checkCoupon,
  getOne,
} from "./coupon.controller.js";

import { authorized } from "../../middleware/globels/authorized.js";
import { enumRoles } from "../../assets/enums/Roles_permissions.js";
import { protectedRoutes } from "../../middleware/auth/protectedRoutes.js";
import { AttributedTo } from "../../middleware/AttributedTo.js";

const couponRouter = express.Router();

couponRouter
  .route("/")
  .post(
    validation(couponSchemaVal),
    protectedRoutes,
    authorized(enumRoles.admin),
    AttributedTo,
    Insert
  )
  .get(protectedRoutes, authorized(enumRoles.admin),   AttributedTo, GetAll);

couponRouter.get("/validate-coupon", protectedRoutes, checkCoupon);

couponRouter
  .route("/:id")
  .get(getOne)
  .put(
    validation(updateCouponSchemaVal),
    protectedRoutes,
    authorized(enumRoles.admin),
    AttributedTo,
    Update
  )
  .delete(
    validation(paramsIdVal),
    protectedRoutes,
    authorized(enumRoles.admin),
    AttributedTo,
    Delete
  );

export default couponRouter;
