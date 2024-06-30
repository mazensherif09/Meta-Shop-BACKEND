import { handleBooleans, handleDollarSign } from "../../utils/QueryHandler.js";
import { AsyncHandler } from "./AsyncHandler.js";

export const QueryHandler = AsyncHandler(async (req, res, next) => {
  if (!Object.keys(req.query)?.length) return next();
  req.query = handleDollarSign(req.query);
  req.query = handleBooleans(req.query);
  return next();
});
