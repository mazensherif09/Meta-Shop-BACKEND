import express from "express";
import {
  PageSchemaVal,
  updatePageSchemaVal,
  paramsIdVal,
} from "./singleType.validation.js";
import { validation } from "../../middleware/globels/validation.js";
import { insert, getPage, updatePage } from "./singleType.controller.js";

import { protectedRoutes } from "../../middleware/auth/protectedRoutes.js";
import { authorized } from "../../middleware/globels/authorized.js";
import { enumRoles } from "../../assets/enums/Roles_permissions.js";
import { AttributedTo } from "../../middleware/globels/AttributedTo.js";
import { keyHandler } from "../../middleware/singleType/singleType.js";
import { tokenDetector } from "../../middleware/auth/tokenDetector.js";
const singleTypeRouter = express.Router();
// get rouets

// post routes
singleTypeRouter.post(
  "/landing",
  protectedRoutes,
  authorized(enumRoles.admin),
  keyHandler("landing"),
  AttributedTo,
  insert
);
singleTypeRouter.post(
  "/about-us",
  protectedRoutes,
  authorized(enumRoles.admin),
  keyHandler("about-us"),
  AttributedTo,
  insert
);
singleTypeRouter.post(
  "/warning",
  protectedRoutes,
  authorized(enumRoles.admin),
  keyHandler("warning"),
  AttributedTo,
  insert
);
// put toutes
singleTypeRouter
  .route("/landing")
  .put(
    protectedRoutes,
    authorized(enumRoles.admin),
    AttributedTo,
    keyHandler("landing"),
    updatePage
  );
singleTypeRouter
  .route("/about-us")
  .put(
    protectedRoutes,
    authorized(enumRoles.admin),
    AttributedTo,
    keyHandler("about-us"),
    updatePage
  );
singleTypeRouter
  .route("/warning")
  .put(
    protectedRoutes,
    authorized(enumRoles.admin),
    AttributedTo,
    keyHandler("warning"),
    updatePage
  );
singleTypeRouter.get("/:key", tokenDetector, getPage);
export default singleTypeRouter;
