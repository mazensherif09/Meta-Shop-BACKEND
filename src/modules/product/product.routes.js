import express from "express";
import { validation } from "../../middleware/globels/validation.js";
import { fileUploadfields } from "../../services/FileUpload/FileUpload.js";
import {
  addproduct,
  getallproduct,
  getOneproduct,
  updateproduct,
  deleteproduct,
} from "./product.controller.js";
import {
  ProductSchemaVal,
  UpdateproductSchemaVal,
  paramsIdVal,
  paramsSlugVal
} from "./product.validation.js";
import { handleMediaProduct } from "../../middleware/handleProduct.js";

import { ownerMiddlewar } from "../../middleware/ownerMiddlewar.js";
import { handlePermissions } from "../../middleware/handlepermissions.js";
import { protectedRoutes } from "../../middleware/auth/protectedRoutes.js";


const productRouter = express.Router();

productRouter
  .route("/")
  .post(validation(ProductSchemaVal), // check validation
    // protectedRoutes, // to check user is authenticated or not
    addproduct
  )
  .get(getallproduct);

  productRouter.get("/:slug", validation(paramsSlugVal), getOneproduct)

  productRouter
  .route("/:id")
  .put(validation(UpdateproductSchemaVal), // check validation
    updateproduct // finally update product
  ).delete(validation(paramsIdVal), deleteproduct);
export { productRouter };
