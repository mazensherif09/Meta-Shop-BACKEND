import express from "express";
import {
  insertFiles,
  findFiles,
  findOneFile,
  deleteColor,
} from "./file.controller.js";
import { fileUploadArray } from "../../services/FileUpload/FileUpload.js";

const fileRouter = express.Router();
fileRouter
  .route("/")
  .get(findFiles)
  .post(fileUploadArray("files"), insertFiles);
fileRouter.route("/:id").get(findOneFile).delete(deleteColor);
export { fileRouter };
