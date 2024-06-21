import { sizeModel } from "../../../database/models/size.model.js";
import { AsyncHandler } from "../../middleware/globels/AsyncHandler.js";
import { AppError } from "../../utils/AppError.js";
import { ApiFetcher } from "../../utils/Fetcher.js";
import { convertObjectKeys } from "../../utils/convertObjectKeys.js";


const addSize = AsyncHandler(async (req, res, next) => {
  const checkDocument = await sizeModel.findOne({ name: req.body?.name });
  if (checkDocument) next(new AppError(`Name is already in use`, 401));

  const document = new sizeModel(req.body);
  await document.save();

   res.status(200).json({succses: true, data: document,}
  );
});

const getSizes = AsyncHandler(async (req, res, next) => {
 // Define the populate array, you can adjust this as per your requirements
 const populateArray = [];

 let filterObject = {};
 if (req.query.filters) {  
    filterObject = req.query.filters;
 }
 
 let apiFetcher = new ApiFetcher(
  sizeModel.find(filterObject) , req.query);

 apiFetcher.search().sort().select().populate(populateArray);

 // Execute the modified query and get total count
 const total = await sizeModel.countDocuments(apiFetcher.queryOrPipeline);

 // Apply pagination after getting total count
 apiFetcher.pagination();

 // Execute the modified query to fetch data
 const data = await apiFetcher.queryOrPipeline.exec();

 // Calculate pagination metadata
 const pages = Math.ceil(total / apiFetcher.metadata.pageLimit);

 res.status(200).json({
   succses: true,
   data,
   metadata: {
     ...apiFetcher.metadata,
     pages,
     total,
   },
 });
});

const deleteSize = AsyncHandler(async (req, res, next) => {
  const document = await sizeModel.findByIdAndDelete({ _id: req.params?.id });
  if (!document) next(new AppError(`Color is not found`, 401));

  res.status(200).json(
    {
      succses: true,
      data: document,
    },
  );
});

const updateSize = AsyncHandler(async (req, res, next) => {
  const document = await sizeModel.findByIdAndUpdate({ _id: req.params?.id }, req.body);
  if (!document) next(new AppError(`Color is not found`, 401));

  res.status(200).json(
    {
      succses: true,
      data: document,
    },
  );
});

export { addSize, getSizes, deleteSize, updateSize };
