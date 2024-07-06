import chalk from "chalk";

export const globalError = (error, req, res, next) => {
  process.env.MODE === 'dev' ?  console.log(chalk.red(error)) : ""
  error.statusCode = error.statusCode || 500;
  error.message = error.message || "error";
  if (process.env.MODE === "dev") {
     return res
      .status(error.statusCode)
      .json({ error: error.message, stack: error.stack });
  } else {
    return res.status(error.statusCode).json({ error: error.message });
   
  }
};
