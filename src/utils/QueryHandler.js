const handleOperators = (obj) => {
  const operators = ["gt", "gte", "lt", "lte", "eq", "ne"];

  function modifyKeys(obj) {
    const modifiedObj = {};

    for (let key in obj) {
      if (key.includes("$") && !operators.includes(key.slice(1))) {
        continue; // Skip keys with $ that are not in operators
      }

      let value = obj[key];

      if (typeof value === "object" && value !== null) {
        value = Array.isArray(value) ? value.map(modifyKeys) : modifyKeys(value);
        if (Object.keys(value).length > 0) {
          modifiedObj[key] = value;
        }
      } else {
        if (!isNaN(value) && typeof value === "string") {
          value = Number(value); // Convert numeric strings to numbers
        }

        if (operators.includes(key)) {
          modifiedObj["$" + key] = value; // Add $ to operators
        } else if (key.includes("$")) {
          modifiedObj[key.replace("$", "")] = value; // Remove $ from keys
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
