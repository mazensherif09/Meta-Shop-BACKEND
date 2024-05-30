export function AsyncHandler(fun) {
  return (req, res, next) => {
    fun(req, res, next).catch((error) => {
      return next(error);
    });
  };
}
