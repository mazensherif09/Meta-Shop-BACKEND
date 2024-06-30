const handleOperator = (obj) => {
  const operators = ["gt", "gte", "lt", "lte", "eq", "ne"];
  // Helper function to recursively modify keys
  function modifyKeys(obj) {
    const modifiedObj = {};
    for (let key in obj) {
      let value = obj[key];
      // Check if key has $ and is not one of the allowed operators
      if (key.includes("$") && !operators.includes(key.slice(1))) {
        // Remove key if it has $ and not in allowed operators
        continue;
      }
      // If value is an object or array, recursively modify keys
      if (typeof value === "object" && value !== null) {
        modifiedObj[key] = Array.isArray(value)
          ? value.map(modifyKeys)
          : modifyKeys(value);
      } else {
        // Check if key is in operators array
        if (operators.includes(key)) {
          // Add $ to the key
          modifiedObj["$" + key] = value;
        } else {
          // Copy key without $
          modifiedObj[key.replace("$", "")] = value;
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
export { handleOperator, handleBooleans };
