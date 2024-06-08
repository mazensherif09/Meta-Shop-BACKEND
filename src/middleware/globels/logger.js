import chalk from "chalk";
import morgan from "morgan";
export const logger = () => {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  const formattedTime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;
  const methodColors = {
    GET: chalk.greenBright,
    POST: chalk.yellow,
    PUT: chalk.blue,
    DELETE: chalk.red,
    PATCH: chalk.magenta,
  };
  return morgan((tokens, req, res) => {
    return [
      chalk.white(`[${formattedTime}]`),
      `${chalk.black(req.protocol)}:`,
      methodColors[tokens.method(req, res)](tokens.method(req, res)),
      tokens.url(req, res),
      `(${Math.ceil(tokens["response-time"](req, res))} ms)`,
      tokens.status(req, res),
    ].join(" ");
  });
};
