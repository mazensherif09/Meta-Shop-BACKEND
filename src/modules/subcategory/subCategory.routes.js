import express from "express";

import {
  addsubCategory,
  getAllsubCategoryies,
  getOnesubCategory,
  updateSubCategorty,
  deletesubCategory,
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
import { addsubCategory, deletesubCategory, getAllsubCategoryies, getOnesubCategory, updateSubCategorty } from "./subCategory.controller.js";

const subCategoryRouter = express.Router({ mergeParams: true });
subCategoryRouter.route("/")
  .post(
    validation(subCategorySchemaVal),
    protectedRoutes,
    authorized(enumRoles.admin),
    AttributedTo,
    addsubCategory
  )
  .get(getAllsubCategoryies);
subCategoryRouter.route("/:id")
  .get(validation(paramsIdVal), getOnesubCategory)
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
    deletesubCategory
  );
export { subCategoryRouter };
