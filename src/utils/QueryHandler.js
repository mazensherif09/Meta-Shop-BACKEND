const handleOperators = (obj) => {
  const operators = ["gt", "gte", "lt", "lte", "eq", "ne"];

  function modifyKeys(obj) {
    const modifiedObj = {};

    for (let key in obj) {
      let value = obj[key];

      if (typeof value === "object" && value !== null) {
        value = Array.isArray(value)
          ? value.map(modifyKeys)
          : modifyKeys(value);
        if (Object.keys(value).length > 0) {
          modifiedObj[key] = value;
        }
      } else {
        if (
          !isNaN(value) &&
          typeof value === "string" &&
          ["gt", "gte", "lt", "lte"].includes(key)
        ) {
          value = Number(value); // Convert numeric strings to numbers
        }

        if (key.startsWith("$") && operators.includes(key.slice(1))) {
          modifiedObj[key] =
            typeof value === "string" ? value.replace(/'/g, "") : value; // Keep $ and valid operators
        } else if (key.includes("$")) {
          modifiedObj[key.replace("$", "")] =
            typeof value === "string" ? value.replace(/'/g, "") : value; // Remove $ from keys
        } else {
          modifiedObj[key] = value; // Copy other keys as is
        }
      }
    }

    return modifiedObj;
  }

  return modifyKeys(obj);
};
const handleBooleans = (obj) => {
  if (typeof obj === "string") {
    if (obj === "true") return true;
    if (obj === "false") return false;
  } else if (Array.isArray(obj)) {
    return obj.map(handleBooleans);
  } else if (typeof obj === "object" && obj !== null) {
    return Object.keys(obj).reduce((acc, key) => {
      acc[key] = handleBooleans(obj[key]);
      return acc;
    }, {});
  }
  return obj;
};
export { handleOperators, handleBooleans };
