import express from "express";
import { validation } from "../../middleware/globels/validation.js";
import { getproduct, createproduct } from "./test.controller.js";

const testRouter = express.Router();

testRouter.route("/products").post(createproduct).get(getproduct);

export default testRouter;
