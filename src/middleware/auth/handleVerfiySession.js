import { AsyncHandler } from "../globels/AsyncHandler.js";

export const handleVerfiySession = AsyncHandler(async (req, res, next) => {
  let token = req.headers.token || req.params.token || req.cookies.token;
  if (!token) return res.status(200).json();
  return next();
});
