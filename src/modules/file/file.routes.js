import express from "express";
import { Insert, GetAll, GetOne, Delete } from "./file.controller.js";
import { fileUploadArray } from "../../services/FileUpload/FileUpload.js";
import { validation } from "../../middleware/globels/validation.js";
import { deleteSchema, uploadSchema } from "./file.validation.js";

const fileRouter = express.Router();
fileRouter.route("/")
  .get(GetAll)
  .post(fileUploadArray("files"), Insert)
  .delete(validation(deleteSchema), Delete);

fileRouter.route("/:id").get(GetOne)
export { fileRouter };
