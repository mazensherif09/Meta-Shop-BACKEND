import { checkUniqueFeilds } from "../globels/checkUniqueFeilds";

const handleSlug = async (model, feild) => {
  const checker = await checkUniqueFeilds(model, feild);
  if (checker) {
    return checker;
  }
  return false;
};
