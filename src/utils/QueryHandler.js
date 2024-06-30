const handleDollarSign = (obj) => {
  const replacer = (key, value) => {
    if (value && typeof value === 'object') {
      const newValue = {};
      Object.keys(value).forEach(k => {
        if (k.match(/^(gt|gte|lt|lte|eq|ne)$/)) {
          newValue['$' + k] = value[k]; // Prefix valid keys with $
        } else if (!k.includes('$')) {
          const nestedValue = handleDollarSign(value[k]); // Recursively handle nested objects
          if (isValidValue(nestedValue)) {
            newValue[k] = nestedValue;
          }
        }
      });
      return newValue;
    }
    return value;
  };
  const isValidValue = (value) => {
    if (value === null || value === undefined) {
      return false;
    } else if (typeof value === 'object' && Object.keys(value).length === 0) {
      return false;
    } else if (typeof value === 'string' && value.trim() === '') {
      return false;
    }
    return true;
  };
  const modifiedObj = JSON.parse(JSON.stringify(obj, replacer));
  // Remove empty values
  const removeEmptyValues = (data) => {
    if (Array.isArray(data)) {
      return data.filter(isValidValue).map(removeEmptyValues);
    } else if (typeof data === 'object' && data !== null) {
      Object.keys(data).forEach(key => {
        const value = data[key];
        if (!isValidValue(value)) {
          delete data[key];
        } else {
          data[key] = removeEmptyValues(value);
        }
      });
    }
    return data;
  };
  return removeEmptyValues(modifiedObj);
}
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
