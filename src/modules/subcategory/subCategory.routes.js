import express from "express";

import {
  subCategorySchemaVal,
  UpdatesubCategorySchemaVal,
  paramsIdVal,
} from "./subcategory.validation.js";
import { validation } from "../../middleware/globels/validation.js";
import { protectedRoutes } from "../../middleware/auth/protectedRoutes.js";
import { authorized } from "../../middleware/globels/authorized.js";
import { enumRoles } from "../../assets/enums/Roles_permissions.js";
import { AttributedTo } from "../../middleware/globels/AttributedTo.js";
import { addSubCategory, deleteSubCategory, getAllSubCategoryies, getOneSubCategory, updateSubCategorty } from "./subcategory.controller.js";

const SubCategoryRouter = express.Router({ mergeParams: true });
SubCategoryRouter.route("/")
  .post(
    validation(subCategorySchemaVal),
    protectedRoutes,
    authorized(enumRoles.admin),
    AttributedTo,
    addSubCategory
  )
  .get(getAllSubCategoryies);
SubCategoryRouter.route("/:id")
  .get(validation(paramsIdVal), getOneSubCategory)
  .put(
    validation(UpdatesubCategorySchemaVal),
    protectedRoutes,
    authorized(enumRoles.admin),
    AttributedTo,
    updateSubCategorty
  )
  .delete(
    validation(paramsIdVal),
    protectedRoutes,
    authorized(enumRoles.admin),
    AttributedTo,
    deleteSubCategory
  );
export { SubCategoryRouter };
