import { UserRouter } from "./user/user.routes.js";
import { AppError } from "../utils/AppError.js";
import { dbConnection } from "../../database/dbConnection.js";
import { categoryRouter } from "./category/category.routes.js";
import { globalError } from "../middleware/globalError.js";
import { SubCategoryRouter } from "./subcategory/subCategory.routes.js";
import { productRouter } from "./product/product.routes.js";

//done

export const bootstrap = (app, express) => {
  const mainroute = "/api/v1"; // main route
  app.use(express.json()); // middlewar  for buffer
  app.use("/uploads", express.static("uploads")); // middlewar for File upload
  // start  Endpoints ----------------------------------------- |
  app.use(`${mainroute}/users`, UserRouter);
  app.use(`${mainroute}/categories`, categoryRouter);
  app.use(`${mainroute}/subcategories`, SubCategoryRouter);
  app.use(`${mainroute}/products`, productRouter);
  // End  Endpoints ------------------------------------------- |
  dbConnection(); // database connection
  app.use("*", (req, res, next) => {
    // handle UnException routes
    return next(new AppError(`not found endPoint: ${req.originalUrl}`, 404));
  });
  app.use(globalError); // error center
};
