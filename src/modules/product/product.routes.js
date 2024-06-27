import express from "express";
import { validation } from "../../middleware/globels/validation.js";
import {
  addproduct,
  getallproduct,
  getOneproduct,
  updateproduct,
  deleteproduct,
  getFeatured
} from "./product.controller.js";
import {
  ProductSchemaVal,
  UpdateproductSchemaVal,
  paramsIdVal,
  paramsSlugVal,
} from "./product.validation.js";
import { protectedRoutes } from "../../middleware/auth/protectedRoutes.js";
import { authorized } from "../../middleware/globels/authorized.js";
import { enumRoles } from "../../assets/enums/Roles_permissions.js";
import { AttributedTo } from "../../middleware/AttributedTo.js";

const productRouter = express.Router();

productRouter
  .route("/")
  .post(
    validation(ProductSchemaVal), // check validation
    protectedRoutes,
    authorized(enumRoles.admin),
    AttributedTo,
    addproduct
  )
  .get(getallproduct);
  productRouter.get("/featured",  getFeatured);

productRouter.get("/:slug", validation(paramsSlugVal), getOneproduct);


productRouter
  .route("/:id")
  .put(
    validation(UpdateproductSchemaVal), // check validation
    protectedRoutes,
    authorized(enumRoles.admin),
    AttributedTo,
    updateproduct // finally update product
  )
  .delete(
    validation(paramsIdVal),
    protectedRoutes,
    authorized(enumRoles.admin),
    AttributedTo,
    deleteproduct
  );
export { productRouter };
