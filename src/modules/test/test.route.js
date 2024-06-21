import express from "express";
import { validation } from "../../middleware/globels/validation.js";

const testRouter = express.Router();

testRouter.route("/products").post();

export default testRouter;
