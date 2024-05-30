import express from "express";
import { validation } from "../../middleware/validation.js";
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
} from "./product.validation.js";
import { handleMediaProduct } from "../../middleware/handleProduct.js";
import { authorized } from "../../middleware/authorized.js";
import { ownerMiddlewar } from "../../middleware/ownerMiddlewar.js";
import { handlePermissions } from "../../middleware/handlepermissions.js";
import { protectedRoutes } from "../../middleware/auth/protectedRoutes.js";

const productRouter = express.Router();

productRouter
  .route("/")
  .post(
    fileUploadfields([
      { name: "imgCover", maxCount: 1 },
      { name: "images", maxCount: 8 },
    ]), // handle files uploaded with multer
    validation(ProductSchemaVal), // check validation
    protectedRoutes, // to check user is authenticated or not
    authorized(["vendor", "super_admin", "brand_Owner"]), // check is this user have authorized to create products
    addproduct
  )
  .get(getallproduct);
productRouter
  .route("/:id")
  .get(validation(paramsIdVal), getOneproduct)
  .put(
    fileUploadfields([
      { name: "imgCover", maxCount: 1 },
      { name: "images", maxCount: 8 },
    ]), // handle files uploaded with multer
    validation(UpdateproductSchemaVal), // check validation
    protectedRoutes, // to check if user is authenticated or not
    authorized(["vendor","adimn","super_admin", "brand_Owner"]), // check is this user have authorized to update products
    ownerMiddlewar, // check is this user have authorized to update this product or not must be [owner or super admin]
    handleMediaProduct, // handle media[files] with cloudinary
    handlePermissions,
    updateproduct // finally update product
  )
  .delete(validation(paramsIdVal), ownerMiddlewar, deleteproduct);
export { productRouter };
