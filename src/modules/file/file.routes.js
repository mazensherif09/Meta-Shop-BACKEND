import express from "express";
import { Insert, GetAll, GetOne, Delete } from "./file.controller.js";
import {
  fileUploadArray,
  fileUploadfields,
} from "../../services/FileUpload/FileUpload.js";
import { validation } from "../../middleware/globels/validation.js";
import { deleteSchema, uploadSchema } from "./file.validation.js";

const fileRouter = express.Router();
fileRouter
  .route("/")
  .get(GetAll)
  .post(
    fileUploadfields([{ name: "files", maxCount: 100 }]),
    validation(uploadSchema),
    Insert
  );
fileRouter.route("/:id").get(GetOne).delete(validation(deleteSchema), Delete);
export { fileRouter };
