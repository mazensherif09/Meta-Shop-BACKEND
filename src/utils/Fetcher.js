export class ApiFetcher {
  constructor(queryOrPipeline, searchQuery) {
    this.queryOrPipeline = queryOrPipeline;
    this.searchQuery = searchQuery;
    this.isPipeline = Array.isArray(queryOrPipeline); // Check if it's a pipeline
    this.populateArray = []; // Initialize populate array
    this.metadata = {}; // Initialize metadata
  }

  // Pagination method
  pagination() {
    let pageNumber = this.searchQuery.page * 1 || 1;
    let pageLimit = this.searchQuery.pagelimit * 1 || 20;
    let skip = (pageNumber - 1) * pageLimit;

    if (this.isPipeline) {
      this.queryOrPipeline.push({ $skip: skip });
      this.queryOrPipeline.push({ $limit: pageLimit });
    } else {
      this.queryOrPipeline.skip(skip).limit(pageLimit);
    }

    this.metadata = {
      page: pageNumber,
      pageLimit: pageLimit,
    };
    return this;
  }

  // Filter method
  filter() {
    if (this.searchQuery.filters) {
      let filterObject = { ...this.searchQuery.filters };

      filterObject = JSON.stringify(filterObject);

      filterObject = filterObject.replace(
        /(gt|gte|lt|lte|eq|ne)/g,
        (match) => "$" + match
      );
      filterObject = JSON.parse(filterObject);
      // Loop through each filter parameter
      for (const key in filterObject) {
        if (typeof filterObject[key] === "object") {
          for (const operator in filterObject[key]) {
            if (["$gt", "$gte", "$lt", "$lte"].includes(operator)) {
              filterObject[key][operator] = Number(filterObject[key][operator]);
            }
          }
        }
        // Handle regex filters
        if (filterObject[key].hasOwnProperty("$regex")) {
          const regexPattern = filterObject[key]["$regex"].replace(
            /^'|'$/g,
            ""
          ); // Remove extra quotes if present
          filterObject[key] = {
            $regex: new RegExp(regexPattern, "i"),
          };
        } else if (filterObject[key].hasOwnProperty("$neregex")) {
          const regexPattern = filterObject[key]["$neregex"].replace(
            /^'|'$/g,
            ""
          ); // Remove extra quotes if present
          filterObject[key] = {
            $not: new RegExp(regexPattern, "i"),
          };
        }
        // Handle special MongoDB operators if present
        if (key === "isFeatured" && filterObject[key]["$eq"] === "true") {
          filterObject[key] = true;
        } else if (
          key === "isFeatured" &&
          filterObject[key]["$eq"] === "false"
        ) {
          // Default behavior: copy filter value as is
          filterObject[key] = false;
        }
      }

      console.log("here is log after proccess", filterObject);

      if (this.isPipeline) {
        this.queryOrPipeline.push({ $match: filterObject });
      } else {
        this.queryOrPipeline.find(filterObject);
      }
    }
    return this;
  }

  // Sort method
  sort() {
    if (this.searchQuery.sort) {
      let sortBy = {};

      this.searchQuery.sort.split(",").forEach((field) => {
        const [key, order] = field.split(":");
        sortBy[key] = order === "desc" ? -1 : 1;
      });

      if (this.isPipeline) {
        this.queryOrPipeline.push({ $sort: sortBy });
      } else {
        this.queryOrPipeline.sort(sortBy);
      }
    }
    return this;
  }

  // Select method
  select() {
    if (this.searchQuery.fields) {
      let fields = {};

      this.searchQuery.fields.split(",").forEach((field) => {
        fields[field] = 1;
      });

      if (this.isPipeline) {
        this.queryOrPipeline.push({ $project: fields });
      } else {
        this.queryOrPipeline.select(fields);
      }
    }
    return this;
  }

  // Search method
  search() {
    if (this.searchQuery.index) {
      let indexQueries = [];

      for (const key in this.searchQuery.index) {
        const value = this.searchQuery.index[key];
        const regexQuery = { [key]: { $regex: value, $options: "i" } };
        indexQueries.push(regexQuery);
      }

      if (this.isPipeline) {
        if (indexQueries.length > 0) {
          this.queryOrPipeline.push({ $match: { $and: indexQueries } });
        }
      } else {
        for (const query of indexQueries) {
          this.queryOrPipeline.find(query);
        }
      }
    }
    return this;
  }

  // Populate method for aggregation pipelines
  populateAggregation(populateArray) {
    if (
      populateArray &&
      Array.isArray(populateArray) &&
      populateArray.length > 0
    ) {
      populateArray.forEach((pop) => {
        this.queryOrPipeline.push({
          $lookup: {
            from: pop.from,
            localField: pop.localField,
            foreignField: pop.foreignField,
            as: pop.as,
          },
        });
        if (pop.unwind) {
          this.queryOrPipeline.push({ $unwind: `$${pop.as}` });
        }
      });
    }
    return this;
  }

  // Populate method for find queries
  populateFind(populateArray) {
    if (
      populateArray &&
      Array.isArray(populateArray) &&
      populateArray.length > 0
    ) {
      this.queryOrPipeline.populate(populateArray);
    }
    return this;
  }

  // Method to get total count
  async getTotalCount(model) {
    if (this.isPipeline) {
      const countPipeline = [...this.queryOrPipeline];
      countPipeline.push({ $count: "totalCount" });
      const result = await model.aggregate(countPipeline).exec();
      return result.length > 0 ? result[0].totalCount : 0;
    } else {
      return await model.countDocuments(this.queryOrPipeline).exec();
    }
  }
}
