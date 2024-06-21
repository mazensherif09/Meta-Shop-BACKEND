import {
  ClothesTestModel,
  FileTestModel,
  ProductTestModel,
  TechTestModel,
  
} from "../../../database/models/test.js";
import { AsyncHandler } from "../../middleware/globels/AsyncHandler.js";
import { AppError } from "../../utils/AppError.js";
import { ApiFetcher } from "../../utils/Fetcher.js";
import { addLookup } from "../../utils/addLookup.js";

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
 // Define the populate array, you can adjust this as per your requirements
 const populateArray = [];
 
 let filterObject = {};
 if (req.query.filters) {  
    filterObject = req.query.filters;
 }

 let pipeline = [];
 // Add category lookup if category is provided
 if (req.query.category) {
   addLookup(pipeline, req.query , "category", "categories", "category", "_id", "slug");
 }
 // Add color lookup and match stages if color is provided
//  if (req.query.color) {
//    addLookup(pipeline, req.query, "color", "colors", "colors.color", "_id", "name");
//  }
//  // Add size lookup and match stages if size is provided
//  if (req.query.size) {
//    addLookup(pipeline, req.query, "size", "sizes", "colors.sizes.size", "_id", "name");
//  }

 // let apiFetcher = new ApiFetcher(pipeline, req.query);

  // Instantiate ApiFetcher with the pipeline and search query
  const apiFetcher = new ApiFetcher(pipeline, req.query);

  // Apply various methods of ApiFetcher
  apiFetcher.sort().select().search();

  // Get total count before executing the final aggregate query
  const total = await apiFetcher.getTotalCount(ProductTestModel);

  // Apply pagination after getting total count
  apiFetcher.pagination();

  // Execute the final aggregate query
  const data = await ProductTestModel.aggregate(apiFetcher.queryOrPipeline);


  if (data.length === 0) {
    throw new AppError("No products found", 404);
  }

  const pages = Math.ceil(total / apiFetcher.metadata.pageLimit);

 res.status(200).json({
   success: true,
   data,
   metadata: {
     ...apiFetcher.metadata,
     pages,
     total,
   },
 });

  // const products = await ProductTestModel.find().populate('images');
  // res.status(200).send(products);
});
const getOnewproduct = AsyncHandler(async (req, res, next) => {
  const product = await ProductTestModel.findById(req.params.id).exec();
  if (!product) {
    return res.status(404).send("Product not found");
  }
});

const testinstertTestData = AsyncHandler(async (req, res, next) => {
  const file1 = new FileTestModel({
    filename: "image1.jpg",
    filepath: "/path/to/image1.jpg",
    mimetype: "image/jpeg",
    size: 1024,
  });
  const file2 = new FileTestModel({
    filename: "image2.jpg",
    filepath: "/path/to/image2.jpg",
    mimetype: "image/jpeg",
    size: 2048,
  });
  const clothes = new ClothesTestModel({
    name: "T-Shirt",
    price: 19.99,
    category: "6675168b2a9230ee7ee33307",
    size: "M",
    color: ["red", "blue"],
    images: [file1._id, file2._id],
  });
  const tech = new TechTestModel({
    name: "Smartphone",
    price: 699.99,
    category: "66750f0fa825d242ee4a80ed",
    specs: {
      processor: "Snapdragon 888",
      ram: "8GB",
      storage: "128GB",
    },
    colors: ["black", "white"],
  });
  await file1.save();
  await file2.save();
  await clothes.save();
  await tech.save();
  res.json({
    message: "success",
    file1,
    file2,
    clothes,
    tech,
  })
});
export { createproduct, Putproduct, getproduct, getOnewproduct,testinstertTestData };
