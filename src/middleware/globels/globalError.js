import chalk from "chalk";
import httpStatus from "../../assets/messages/httpStatus.js";

export const globalError = (error, req, res, next) => {
  process.env.MODE === "dev" ? console.log(chalk.red(error?.message)) : "";
  let code = error.code || 500;
  let message = error.message || "error";

  if (message === httpStatus.Forbidden.message) {
    res.cookie(
      "token",
      "",
      SetCookie({
        maxAge: 0,
      })
    );
  }

  if (process.env.MODE === "dev") {
    return res.status(code).json({ message, stack: error.stack });
  } else {
    return res.status(code).json({ message });
  }
};
