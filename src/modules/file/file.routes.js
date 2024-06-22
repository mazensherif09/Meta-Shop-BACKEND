import express from "express";
import { Insert, GetAll, GetOne, Delete } from "./file.controller.js";
import { fileUploadArray } from "../../services/FileUpload/FileUpload.js";

const fileRouter = express.Router();
fileRouter.route("/").get(GetAll).post(fileUploadArray("files"), Insert);
fileRouter.route("/:id").get(GetOne).delete(Delete);
export { fileRouter };
