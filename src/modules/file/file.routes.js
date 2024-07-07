import express from "express";
import { Insert, GetAll, GetOne, Delete } from "./file.controller.js";

import { validation } from "../../middleware/globels/validation.js";
import { deleteSchema, uploadSchema } from "./file.validation.js";
import { protectedRoutes } from "../../middleware/auth/protectedRoutes.js";
import { authorized } from "../../middleware/globels/authorized.js";
import { enumRoles } from "../../assets/enums/Roles_permissions.js";
import { AttributedTo } from "../../middleware/globels/AttributedTo.js";
import { fileUploadSingle } from "../../utils/FileUpload.js";

const fileRouter = express.Router();
fileRouter
  .route("/")
  .get(GetAll)
  .post(
    fileUploadSingle("file"),
    validation(uploadSchema),
    protectedRoutes,
    authorized(enumRoles.admin),
    AttributedTo,
    Insert
  );
fileRouter
  .route("/:id")
  .get(GetOne)
  .delete(
    validation(deleteSchema),
    protectedRoutes,
    authorized(enumRoles.admin),
    AttributedTo,
    Delete
  );
export { fileRouter };
