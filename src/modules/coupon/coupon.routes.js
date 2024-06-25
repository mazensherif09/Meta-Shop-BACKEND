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

const couponRouter = express.Router();

couponRouter
  .route("/")
  .post(
    protectedRoutes,
    authorized(enumRoles.admin),
    validation(couponSchemaVal),
    Insert
  )
  .get(protectedRoutes, authorized(enumRoles.admin), GetAll);

couponRouter.get("/validate-coupon", protectedRoutes, checkCoupon);

couponRouter
  .route("/:id")
  .get(getOne)
  .put(
    protectedRoutes,
    authorized(enumRoles.admin),
    validation(updateCouponSchemaVal),
    Update
  )
  .delete(
    protectedRoutes,
    authorized(enumRoles.admin),
    validation(paramsIdVal),
    Delete
  );

export default couponRouter;
