import { UserRouter } from "./user/user.routes.js";
import { AppError } from "../utils/AppError.js";
import { dbConnection } from "../../database/dbConnection.js";
import { categoryRouter } from "./category/category.routes.js";

import { SubCategoryRouter } from "./subcategory/subCategory.routes.js";
import { productRouter } from "./product/product.routes.js";
import cartRouter from "./cart/cart.routes.js";
import orderRouter from "./order/order.routes.js";
import addressRouter from "./address/address.routes.js";
import { AuthRouter } from "./auth/auth.routes.js";
import { globalError } from "../middleware/globels/globalError.js";

export const bootstrap = (app, express) => {
  const mainroute = "/api"; // main route
  app.use(express.json()); // middlewar  for buffer
  app.use("/uploads", express.static("uploads")); // middlewar for File upload
  // start  Endpoints ----------------------------------------- |
  app.get("/api", (req, res) => {
    return res.json({
      status: "success",
      message: "Welcome to Meta-Shop API",
    });
  });
  app.use(`${mainroute}/auth`,AuthRouter); // middlewar for
  app.use(`${mainroute}/users`, UserRouter);
  app.use(`${mainroute}/categories`, categoryRouter);
  app.use(`${mainroute}/subcategories`, SubCategoryRouter);
  app.use(`${mainroute}/products`, productRouter);
  app.use(`${mainroute}/cart`, cartRouter);
  app.use(`${mainroute}/order`, orderRouter);
  app.use(`${mainroute}/addresses`, addressRouter);
  // End  Endpoints ------------------------------------------- |
  dbConnection(); // database connection

  app.use("*", (req, res, next) => {
    // handle UnException routes
    return next(new AppError(`not found endPoint: ${req.originalUrl}`, 404));
  });
  app.use(globalError); // error center
};
