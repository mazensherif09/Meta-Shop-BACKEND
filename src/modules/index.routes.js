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
export const bootstrap = (app, express) => {
  const mainroute = "/api"; // main route
  const corsOptions = {
    origin: process.env.DOMAINS.split(","), // List of allowed origins
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"], // Allowed HTTP methods
    allowedHeaders: [
      "Content-Type", // Required for POST requests with a JSON or XML body
      "Authorization", // Required if you're using authorization headers
      "Access-Control-Allow-Origin",
      "X-Requested-With", // Required for XMLHttpRequests
      "X-File-Name", // Required for file uploads
      "X-File-Size", // Required for chunked uploads
      "X-File-Type", // Required for chunked uploads
      "Content-Disposition", // Required for file uploads
    ],
  };
  app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(logger()); // logging requests in terminal
  app.use(cors(corsOptions)); // Use the CORS middleware with the specified options
  app.use(helmet()); //  Use helmet to enhance your app's security and for handle XSS attacks
  app.use(express.json()); // middlewar  for buffer
  app.use(cookieParser()); // for handle cookies
  // start  Endpoints ----------------------------------------- |
  app.get(mainroute, (req, res) => {
    return res.status(200).json({
      status: "success",
      message: "Welcome to LUNADELUXO API",
    });
  });
  app.use(`${mainroute}/auth`, AuthRouter); // middlewar for
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
  // End  Endpoints ------------------------------------------- |
  dbConnection(); // database connection

  app.use("*", (req, res, next) => {
    // handle UnException routes
    return next(new AppError(`not found endPoint: ${req.originalUrl}`, 404));
  });
  app.use(globalError); // error center
};
