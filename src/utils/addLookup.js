// Helper function to add color or size lookup and match stages
export function addLookup(
    pipeline,
    searchQuery,
    field,
    fromCollection,
    localField,
    foreignField,
    matchField
  ) {
    if (searchQuery[field]) {
      pipeline.push({
        $lookup: {
          from: fromCollection,
          localField: localField,
          foreignField: foreignField,
          as: field,
        },
      });
      pipeline.push({ $match: { [`${field}.${matchField}`]: searchQuery[field] } });
    }
  }
  