import express from "express";

import {
  addOneCategory,
  getOneCategory,
  getAllCategoryies,
  updateOneCategory,
  deleteOneCategory,
} from "./category.controller.js";
import {
  CategorySchemaVal,
  UpdateCategorySchemaVal,
  paramsIdVal,
} from "./category.validation.js";
import { validation } from "../../middleware/globels/validation.js";
import { protectedRoutes } from "../../middleware/auth/protectedRoutes.js";
import { authorized } from "../../middleware/globels/authorized.js";
import { enumRoles } from "../../assets/enums/Roles_permissions.js";
import { AttributedTo } from "../../middleware/globels/AttributedTo.js";
import { subCategoryRouter } from "../subcategory/subCategory.routes.js";
import { tokenDetector } from "../../middleware/auth/tokenDetector.js";

const categoryRouter = express.Router();
categoryRouter.use("/:category/subcategories", subCategoryRouter);
categoryRouter
  .route("/")
  .post(
    validation(CategorySchemaVal),
    protectedRoutes,
    authorized(enumRoles.admin),
    AttributedTo,
    addOneCategory
  )
  .get(getAllCategoryies);
categoryRouter
  .route("/:id")
  .get(validation(paramsIdVal), tokenDetector, getOneCategory)
  .put(
    validation(UpdateCategorySchemaVal),
    protectedRoutes,
    authorized(enumRoles.admin),
    AttributedTo,
    updateOneCategory
  )
  .delete(
    validation(paramsIdVal),
    protectedRoutes,
    authorized(enumRoles.admin),
    AttributedTo,
    deleteOneCategory
  );
export { categoryRouter };
