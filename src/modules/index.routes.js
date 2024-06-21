import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { UserRouter } from "./user/user.routes.js";
import { AppError } from "../utils/AppError.js";
import { dbConnection } from "../../database/dbConnection.js";
import { categoryRouter } from "./category/category.routes.js";

import { SubCategoryRouter } from "./subcategory/subCategory.routes.js";
import { AuthRouter } from "./auth/auth.routes.js";
import { globalError } from "../middleware/globels/globalError.js";
import cookieParser from "cookie-parser";
import { logger } from "../middleware/globels/logger.js";

import { productRouter } from "./product/product.routes.js";
import couponRouter  from "./coupon/coupon.routes.js";
import cartRouter from "./cart/cart.routes.js";
import orderRouter from "./order/order.routes.js";
import colorsRouter from "./colors/colors.routes.js";
import sizesRouter from "./sizes/sizes.routes.js";

import influncerRouter from "./influncer/influncer.routes.js";
import singleTypeRouter from "./singleType/singleType.routes.js";

import  testRouter  from "./test/test.route.js";
export const bootstrap = (app, express) => {
  const mainroute = "/api"; // main route
  const corsOptions = {
    origin: process.env.FrontUrl || '*', // Replace with your frontend domain
    methods: ["GET", "POST", "PUT", "DELETE", "patch"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  };
  //process.env.mode !== "dev" ? corsOptions :
  app.use(logger()); // logging requests in terminal
  app.use(cors( { origin: 'http://127.0.0.1:3000',credentials:true})); // Use the CORS middleware with the specified options
  app.use(helmet()); //  Use helmet to enhance your app's security and for handle XSS attacks
  app.use(express.json()); // middlewar  for buffer
  app.use(cookieParser()); // for handle cookies
  app.use("/uploads", express.static("uploads")); // middlewar for File upload

  // start  Endpoints ----------------------------------------- |
  app.get(mainroute, (req, res) => {
    console.log(req.query);
    return res.status(200).json({
      status: "success",
      message: "Welcome to Meta-Shop API",
    });
  });
  app.use(`${mainroute}/auth`, AuthRouter); // middlewar for
  app.use(`${mainroute}/users`, UserRouter);
  app.use(`${mainroute}/carts`, cartRouter);
  app.use(`${mainroute}/categories`, categoryRouter);
  app.use(`${mainroute}/subcategories`, SubCategoryRouter);
  app.use(`${mainroute}/products`, productRouter);
  app.use(`${mainroute}/orders`, orderRouter);
  app.use(`${mainroute}/sizes`, sizesRouter);
  app.use(`${mainroute}/colors`, colorsRouter);
  app.use(`${mainroute}/coupon`, couponRouter);
<<<<<<< HEAD
  app.use(`${mainroute}/influncer`, influncerRouter);
  app.use(`${mainroute}/pages`, singleTypeRouter);
=======
  app.use(`${mainroute}/test`, testRouter);
>>>>>>> 1c4fa1c834b4ee6bda6b3f58a04a1ca4a934c542
  // End  Endpoints ------------------------------------------- |
  dbConnection(); // database connection

  app.use("*", (req, res, next) => {
    // handle UnException routes
    return next(new AppError(`not found endPoint: ${req.originalUrl}`, 404));
  });
  app.use(globalError); // error center
};
