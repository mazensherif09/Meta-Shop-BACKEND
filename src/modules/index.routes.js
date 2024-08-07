import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { UserRouter } from "./user/user.routes.js";
import { AppError } from "../utils/AppError.js";
import { dbConnection } from "../../database/dbConnection.js";
import { categoryRouter } from "./category/category.routes.js";
import { AuthRouter } from "./auth/auth.routes.js";
import { globalError } from "../middleware/globels/globalError.js";
import cookieParser from "cookie-parser";
import { logger } from "../middleware/globels/logger.js";

import { productRouter } from "./product/product.routes.js";
import couponRouter from "./coupon/coupon.routes.js";
import cartRouter from "./cart/cart.routes.js";
import orderRouter from "./order/order.routes.js";
import colorsRouter from "./colors/colors.routes.js";
import sizesRouter from "./sizes/sizes.routes.js";
import influncerRouter from "./influncer/influncer.routes.js";
import singleTypeRouter from "./singleType/singleType.routes.js";
import { fileRouter } from "./file/file.routes.js";
import { subCategoryRouter } from "./subcategory/subCategory.routes.js";
import bodyParser from "body-parser";
import { corsOptions } from "../../config/middlewars.js";
import { customProductRouter } from "./customProduct/customProduct.routes.js";
export const bootstrap = (app, express) => {
  const mainroute = "/api"; // main route
  app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" })); // for handle limitations of urlencoded
  app.use(bodyParser.json({ limit: "50mb" })); // for handle limitations of json parsing
  app.use(logger()); // logging requests in terminal
  app.use(cors(corsOptions)); // Use the CORS middleware with the specified options
  app.use(helmet()); //  Use helmet to enhance your app's security and for handle XSS attacks
  app.use(cookieParser()); // for handle cookies
  // start  Endpoints ----------------------------------------- |
  app.get(mainroute, (req, res) => {
    return res.status(200).json({
      status: "success",
      message: "Welcome to LUNADELUXO API",
    });
  });
  app.use(`${mainroute}/auth`, AuthRouter);
  app.use(`${mainroute}/users`, UserRouter);
  app.use(`${mainroute}/files`, fileRouter);
  app.use(`${mainroute}/carts`, cartRouter);
  app.use(`${mainroute}/categories`, categoryRouter);
  app.use(`${mainroute}/subcategories`, subCategoryRouter);
  app.use(`${mainroute}/products`, productRouter);
  app.use(`${mainroute}/orders`, orderRouter);
  app.use(`${mainroute}/sizes`, sizesRouter);
  app.use(`${mainroute}/colors`, colorsRouter);
  app.use(`${mainroute}/coupons`, couponRouter);
  app.use(`${mainroute}/influencers`, influncerRouter);
  app.use(`${mainroute}/single-type`, singleTypeRouter);
  app.use(`${mainroute}/custom-product`, customProductRouter);
  // End  Endpoints ------------------------------------------- |
  dbConnection(); // database connection
  app.use("*", (req, res, next) => {
    // handle UnException routes
    return next(
      new AppError({
        message: `not found endPoint: ${req.originalUrl}`,
        code: 404,
      })
    );
  });
  app.use(globalError); // error center
};
