export const handleArray = (arrayname, method, valueID) => {
  if (
    !arrayname ||
    !method ||
    !valueID ||
    (method !== "push" && method !== "pull")
  )
    return "";

  const f = {
    ["$" + method]: {
      [arrayname]: valueID,
    },
  };

  return { ...f };
};
