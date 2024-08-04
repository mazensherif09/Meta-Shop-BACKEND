import express from "express";

import {
  addOneSubCategory,
  updateOneSubCategory,
  getOneSubCategory,
  getAllSubCategories,
  deleteOneSubCategory,
} from "./subCategory.controller.js";

import {
  subCategorySchemaVal,
  UpdatesubCategorySchemaVal,
  paramsIdVal,
} from "./subCategory.validation.js";
import { validation } from "../../middleware/globels/validation.js";
import { protectedRoutes } from "../../middleware/auth/protectedRoutes.js";
import { authorized } from "../../middleware/globels/authorized.js";
import { enumRoles } from "../../assets/enums/Roles_permissions.js";
import { AttributedTo } from "../../middleware/globels/AttributedTo.js";
import { tokenDetector } from "../../middleware/auth/tokenDetector.js";
const subCategoryRouter = express.Router({ mergeParams: true });
subCategoryRouter
  .route("/")
  .post(
    validation(subCategorySchemaVal),
    protectedRoutes,
    authorized(enumRoles.admin),
    AttributedTo,
    addOneSubCategory
  )
  .get(tokenDetector, getAllSubCategories);
subCategoryRouter
  .route("/:id")
  .get(validation(paramsIdVal), tokenDetector, getOneSubCategory)
  .put(
    validation(UpdatesubCategorySchemaVal),
    protectedRoutes,
    authorized(enumRoles.admin),
    AttributedTo,
    updateOneSubCategory
  )
  .delete(
    validation(paramsIdVal),
    protectedRoutes,
    authorized(enumRoles.admin),
    AttributedTo,
    deleteOneSubCategory
  );
export { subCategoryRouter };
