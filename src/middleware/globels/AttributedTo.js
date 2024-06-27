export const AttributedTo = (req, res, next) => {
  // Check HTTP method and set appropriate fields
  if (req.method === "POST") {
    req.body.createdBy = req.user._id;
  } else if (req.method === "PUT") {
    req.body.updatedBy = req.user._id;
  }

  next(); 
};
