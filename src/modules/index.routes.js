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
    origin: process.env.DOMAINS.split(","),
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "patch"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  };

  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

  // Middleware for logging requests
  app.use(logger("dev")); // Using 'dev' format for morgan

  // Enable CORS with specific domains
  app.use(cors(corsOptions));

  // Use helmet to enhance security
  app.use(helmet());

  // Use cookie parser to handle cookies
  app.use(cookieParser());

  // Serve static files from the 'uploads' directory
  app.use("/uploads", express.static("uploads"));

  // Increase the request and response timeout to 10 minutes
  app.use((req, res, next) => {
    req.setTimeout(10 * 60 * 1000); // 10 minutes
    res.setTimeout(10 * 60 * 1000); // 10 minutes
    next();
  });

  // start  Endpoints ----------------------------------------- |
  app.get(mainroute, (req, res) => {
    console.log(req.query);
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
