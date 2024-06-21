export class ApiFetcher {
  constructor(queryOrPipeline, searchQuery) {
    console.log("🚀 ~ ApiFetcher ~ constructor ~ queryOrPipeline:", queryOrPipeline)
    this.queryOrPipeline = queryOrPipeline;
    this.searchQuery = searchQuery;

    this.metadata = {}; // Initialize metadata
  }
  

  pagination() {
    let pageNumber = this.searchQuery.page * 1 || 1;
    let pageLimit = this.searchQuery.pagelimit * 1 || 20;
    let skip = (pageNumber - 1) * pageLimit;

    if (Array.isArray(this.queryOrPipeline)) {
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

  filter() {
    if (this.searchQuery) {
      let filterObject = { ...this.searchQuery.filter };
      filterObject = JSON.stringify(filterObject);
      filterObject = filterObject.replace(
        /(gt|gte|lt|lte)/g,
        (match) => "$" + match
      );
      filterObject = JSON.parse(filterObject);

      if (Array.isArray(this.queryOrPipeline)) {
        // For pipeline, push $match stage
        this.queryOrPipeline.push({ $match: filterObject });
      } else {
        // For basic find query, apply filter directly
        this.queryOrPipeline.find(filterObject);
      }
    }
    return this;
  }

  sort() {
    if (this.searchQuery.sort) {
      let sortBy = {};

      this.searchQuery.sort.split(",").forEach((field) => {
        const [key, order] = field.split(":");
        sortBy[key] = order === "desc" ? -1 : 1;
      });

      if (Array.isArray(this.queryOrPipeline)) {
        // For pipeline, push $sort stage
        this.queryOrPipeline.push({ $sort: sortBy });
      } else {
        // For basic find query, apply sort directly
        this.queryOrPipeline.sort(sortBy);
      }
    }
    return this;
  }

  select() {
    if (this.searchQuery.fields) {
      let fields = {};

      this.searchQuery.fields.split(",").forEach((field) => {
        fields[field] = 1;
      });

      if (Array.isArray(this.queryOrPipeline)) {
        // For pipeline, push $project stage
        this.queryOrPipeline.push({ $project: fields });
      } else {
        // For basic find query, apply select directly
        this.queryOrPipeline.select(fields);
      }
    }
    return this;
  }

  search() {
    if (this.searchQuery.index) {
      let indexQueries = [];

      for (const key in this.searchQuery.index) {
        const value = this.searchQuery.index[key];
        const regexQuery = { [key]: { $regex: value, $options: "i" } };
        indexQueries.push(regexQuery);
      }

      if (Array.isArray(this.queryOrPipeline)) {
        // For pipeline, push $match stage with $and operator
        if (indexQueries.length > 0) {
          this.queryOrPipeline.push({ $match: { $and: indexQueries } });
        }
      } else {
        // For basic find query, apply filter directly
        for (const query of indexQueries) {
          this.queryOrPipeline.find(query);
        }
      }
    }
    return this;
  }

  populate(populateArray) {
    let populate = this.searchQuery.populate;

    if (populate) {
      if (Array.isArray(this.queryOrPipeline)) {
        // For pipeline, push $lookup stage
        if (populate === "*") {
          this.queryOrPipeline.push({ $lookup: { from: populateArray } });
        } else {
          this.queryOrPipeline.push({ $lookup: { from: populate, localField: "category", foreignField: "_id", as: "categoryDetails" } });
        }
      } else {
        // For basic find query, apply populate directly
        this.queryOrPipeline.populate(populate);
      }
    }
    return this;
  }

  async getTotalCount(model) {
    const countPipeline = [...this.queryOrPipeline];
    countPipeline.push({ $count: 'totalCount' });
    const result = await model.aggregate(countPipeline).exec();
    return result.length > 0 ? result[0].totalCount : 0;
  }
}
