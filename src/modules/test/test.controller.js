import { ClothesTestModel, TechTestModel } from "../../../database/models/test.js";
import { AsyncHandler } from "../../middleware/globels/AsyncHandler.js";

const createproduct = AsyncHandler(async (req, res, next) => {
  const { category, ...rest } = req.body;

  let product;
  if (category === "clothes") {
    product = new ClothesTestModel(rest);
  } else if (category === "tech") {
    product = new TechTestModel(rest);
  } else {
    return res.status(400).send("Invalid category");
  }

  await product.save();
  res.status(201).send(product);
});
const Putproduct = AsyncHandler(async (req, res, next) => {
  const { category, ...rest } = req.body;
  let product;
  if (category === "clothes") {
    product = await ClothesTestModel.findByIdAndUpdate(req.params.id, rest, {
      new: true,
      runValidators: true,
    }).exec();
  } else if (category === "tech") {
    product = await TechTestModel.findByIdAndUpdate(req.params.id, rest, {
      new: true,
      runValidators: true,
    }).exec();
  } else {
    return res.status(400).send("Invalid category");
  }
  if (!product) {
    return res.status(404).send("Product not found");
  }
  res.status(200).send(product);
});
const getproduct = AsyncHandler(async (req, res, next) => {
  const products = await ProductTestModel.find().exec();
  res.status(200).send(products);
});
const getOnewproduct = AsyncHandler(async (req, res, next) => {
  const product = await ProductTestModel.findById(req.params.id).exec();
  if (!product) {
    return res.status(404).send("Product not found");
  }
});
