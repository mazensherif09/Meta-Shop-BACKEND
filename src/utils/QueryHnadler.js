import mongoose from "mongoose";
export const handleOperators = (obj) => {
  const operators = ["gt", "gte", "lt", "lte", "eq", "ne", "regex"];
  function modifyKeys(obj) {
    const modifiedObj = {};

    for (let key in obj) {
      if (key.includes("$") && !operators.includes(key.slice(1))) {
        continue; // Skip keys with $ that are not in operators
      }

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

        if (operators.includes(key)) {
          modifiedObj["$" + key] =
            typeof value === "string" ? value.replace(/'/g, "") : value; // Add $ to operators
        } else if (key.includes("$") && !operators.includes(key.slice(1))) {
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
export const handleBooleans = (obj) => {
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
export const handleQuerySlugOrid = (val) => {
  if (mongoose.Types.ObjectId.isValid(val)) {
    return { _id: val };
  } else {
    return { slug: val };
  }
};
export const convrtQueryToIn = (val) => {
  if (typeof val === "string" && val?.includes(",")) {
    val = { $in: val?.split(",").filter(Boolean) };
  }
  return val;
};
export const handleFilterwithLookUp = (filters = [], searchQuery = {}) => {
  let pipeline = [];
  try {
    filters?.map((val) => {
      const {
        field = "",
        fromCollection = "",
        localField = "",
        foreignField = "",
        matchField = "",
        unwind = false,
      } = val;
      if (searchQuery[field]) {
        pipeline.push({
          $lookup: {
            from: fromCollection,
            localField: localField,
            foreignField: foreignField,
            as: field,
          },
        });
        if (unwind) {
          pipeline.push({ $unwind: `$${field}` });
        }
        pipeline.push({
          $match: {
            [`${field}.${matchField}`]: convrtQueryToIn(searchQuery[field]),
          },
        });
        delete searchQuery[field];
      }
    });
  } catch (e) {
    console.error(`Error in handleFilterwithLookUp: ${e}`);
  }
  return pipeline;
};
export const convertObjectKeys = (input = {}) => {
  const result = {};
  try {
    input =
      typeof input === "object"
        ? input
        : Object.fromEntries(new URL(input)?.searchParams);
    for (const [key, value] of Object.entries(input)) {
      const parts = key.split(/[\[\]]+/).filter(Boolean); // Split by '[' and ']', filter out empty strings
      let current = result;
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (i === parts.length - 1) {
          current[part] = value; // Set the value for the last part
        } else {
          current = current[part] = current[part] || {}; // Create nested object if it doesn't exist
        }
      }
    }
  } catch (e) {}
  return result;
};
export const handleArrayInQuery = (obj = {}, remove = []) => {
  // Create a new object to store the converted values
  const convertedObj = {};

  // Loop through each key-value pair in the object
  for (const key in obj) {
    // Check if the key should be removed
    if (!remove.includes(key)) {
      const value = obj[key];

      // Check if the value is a string and contains commas
      if (typeof value === "string" && value.includes(",")) {
        // Split the string into an array using commas as delimiters
        convertedObj[key] = value.split(",");
      } else {
        // If not a string with commas, keep the original value
        convertedObj[key] = value;
      }
    }
  }

  return convertedObj;
};
export const handleMultiQuery = (query, target, value) => {
  if (!query || !value || !target) {
    return;
  }
  if (typeof value === "object") {
    return { [query]: { [target]: { $in: value } } };
  }
  return {
    [query]: { [target]: { $eq: value } },
  };
};
export const handleSingleQuery = (query, target, operator, value) => {
  if (!query || !value || !operator || !target) {
    return;
  }
  return {
    [query]: {
      [target]: {
        [operator]: value,
      },
    },
  };
};
export const handlePage = (page = 1) => {
  // Check if page is a number and greater than or equal to 1
  if (typeof +page === "number" && +page >= 1) {
    return +page;
  } else {
    return 1;
  }
};
