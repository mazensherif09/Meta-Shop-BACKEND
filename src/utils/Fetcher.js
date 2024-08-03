export class ApiFetcher {
  constructor(pipeline, searchQuery) {
    this.pipeline = Array.isArray(pipeline) ? pipeline : [];
    this.searchQuery = searchQuery;
    this.metadata = {};
  }
  // Pagination method
  pagination() {
    const pageNumber = parseInt(this.searchQuery.page, 10) || 1;
    const pageLimit = parseInt(this.searchQuery.pagelimit, 10) || 20;
    const skip = (pageNumber - 1) * pageLimit;
    this.pipeline.push({ $skip: skip }, { $limit: pageLimit });
    this.metadata = { page: pageNumber, pageLimit };
    return this;
  }
  // Filter method
  filter() {
    if (this.searchQuery.filters) {
      let query = JSON.stringify(this.searchQuery.filters);
      query = query
        // Replace any occurrences of $ with an empty string
        .replace(/\$/g, "")
        // Add $ prefix to operators like gt, gte, lt, lte, regex, ne, eq
        .replace(
          /("gt":|"gte":|"lt":|"lte":|"regex":|"ne":|"eq":)/g,
          (match) => `"$${match.slice(1)}`
        )
        // Convert boolean strings to actual booleans
        .replace(/"true"|"false"/g, (match) =>
          match === '"true"' ? true : false
        )
        // Split comma-separated values into arrays
        .replace(/"([^"]+)":\s*"([^"]*?)"/g, (match, key, value) => {
          // Check if the value contains commas and format it with $in if needed
          const arrayValue = value.includes(",")
            ? `{ "$in": ${JSON.stringify(
                value.split(",").map((item) => item.trim())
              )} }`
            : `"${value}"`;
          return `"${key}": ${arrayValue} `;
        });
      // Parse the modified JSON string back to an object
      query = JSON.parse(query);
      if (Object.keys(query)?.length) {
        this.pipeline.push({ $match: query });
      }
    }
    return this;
  }
  // Sort method
  sort() {
    if (this.searchQuery.sort) {
      const sortBy = this.searchQuery?.sort
        ?.split(",")
        ?.reduce((acc, field) => {
          const [key, order] = field.split(":");
          acc[key] = order === "desc" ? -1 : 1;
          return acc;
        }, {});
      this.pipeline.push({ $sort: sortBy });
    }
    return this;
  }
  // Select method
  select() {
    if (this.searchQuery.fields) {
      const fields = this.searchQuery.fields.split(",").reduce((acc, field) => {
        acc[field] = 1;
        return acc;
      }, {});
      this.pipeline.push({ $project: fields });
    }
    return this;
  }
  // Search method
  search() {
    if (this.searchQuery.index) {
      const indexQueries = Object.keys(this.searchQuery.index).map((key) => ({
        [key]: { $regex: this.searchQuery.index[key], $options: "i" },
      }));
      if (indexQueries.length) {
        this.pipeline.push({ $match: { $and: indexQueries } });
      }
    }
    return this;
  }
  // Populate method
  populate(populateArray) {
    if (Array.isArray(populateArray) && populateArray.length) {
      populateArray.forEach((pop) => {
        this.pipeline.push({
          $lookup: {
            from: pop.from,
            localField: pop.localField,
            foreignField: pop.foreignField,
            as: pop.as,
          },
        });
        if (pop.unwind) {
          this.pipeline.push({ $unwind: `$${pop.as}` });
        }
      });
    }
    return this;
  }
  // Method to get total count of documents after applying filters
  async count(model) {
    const countPipeline = this.pipeline.filter((stage) => {
      const key = Object.keys(stage)[0];
      return key === "$match" || key === "$lookup" || key === "$unwind";
    });
    countPipeline.push({ $count: "totalCount" });
    const result = await model.aggregate(countPipeline).exec();
    return result.length ? result[0].totalCount : 0;
  }
}
