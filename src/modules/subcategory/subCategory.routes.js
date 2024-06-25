import express from "express";

import {
  addSubCategory,
  getAllSubCategoryies,
  getOneSubCategory,
  updateSubCategorty,
  deleteSubCategory,
} from "./subcategory.controller.js";

import {
  subCategorySchemaVal,
  UpdatesubCategorySchemaVal,
  paramsIdVal,
} from "./subcategory.validation.js";
import { validation } from "../../middleware/globels/validation.js";
import { protectedRoutes } from "../../middleware/auth/protectedRoutes.js";
import { authorized } from "../../middleware/globels/authorized.js";
import { enumRoles } from "../../assets/enums/Roles_permissions.js";

const SubCategoryRouter = express.Router({ mergeParams: true });
SubCategoryRouter.route("/")
  .post(
    validation(subCategorySchemaVal),
    protectedRoutes,
    authorized(enumRoles.admin),
    addSubCategory
  )
  .get(getAllSubCategoryies);
SubCategoryRouter.route("/:id")
  .get(validation(paramsIdVal), getOneSubCategory)
  .put(
    validation(UpdatesubCategorySchemaVal),
    protectedRoutes,
    authorized(enumRoles.admin),
    updateSubCategorty
  )
  .delete(
    validation(paramsIdVal),
    protectedRoutes,
    authorized(enumRoles.admin),
    deleteSubCategory
  );
export { SubCategoryRouter };
