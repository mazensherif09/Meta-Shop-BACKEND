const handleDollarSign = (obj) => {
  const replacer = (key, value) => {
    if (value && typeof value === 'object') {
      const newValue = {};
      Object.keys(value).forEach(k => {
        const newKey = k.match(/^(gt|gte|lt|lte|eq|ne)$/) ? '$' + k : k;
        newValue[newKey] = value[k];
      });
      return newValue;
    }
    return value;
  };

  return JSON.parse(JSON.stringify(obj, replacer));
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
export { handleDollarSign, handleBooleans };
