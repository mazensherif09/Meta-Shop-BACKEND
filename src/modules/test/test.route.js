import express from "express";
import { validation } from "../../middleware/globels/validation.js";
import { testinstertTestData } from "./test.controller.js";

const testRouter = express.Router();

testRouter.route("/products").post(testinstertTestData);

export default testRouter;
