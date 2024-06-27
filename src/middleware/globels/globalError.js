import chalk from "chalk";

export const globalError = (error, req, res, next) => {
  console.log(chalk.red(error));
  error.statusCode = error.statusCode || 500;
  error.message = error.message || "error";
  if (process.env.MODE === "prod") {
    return res.status(error.statusCode).json({ error: error.message });
  } else {
    return res
      .status(error.statusCode)
      .json({ error: error.message, stack: error.stack });
  }
};
