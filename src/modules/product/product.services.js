import {
  ClothesModel,
  DecorModel,
} from "../../../database/models/product.model.js";
const ClothesCase = ({
  product,
  color,
  size,
  quantity,
  cart,
  bulkOperations,
  orderItems,
}) => {


  const colorMatch = product?.colors?.find((c) =>
    c?.color?._id.equals(color?._id)
  );
 
  const sizeMatch = colorMatch?.sizes?.find((s) =>
    s?.size?._id.equals(size?._id)
  );


  
  if (!product._id || !colorMatch || !sizeMatch || sizeMatch.stock < quantity)  return false
  
  // Add formatted order item to list
  orderItems.push({
    original_id: product?._id,
    name: product?.name,
    price: product?.price,
    discount: product?.discount,
    quantity: quantity,
    poster: product?.poster?.url,
    type: product?.type,
    selectedOptions: {
      color: {
        original_id: colorMatch?.color?._id,
        name: colorMatch?.color?.name,
        code: colorMatch?.color?.code,
      },
      size: {
        original_id: sizeMatch.size,
        name: sizeMatch.size.name,
      },
    },
  });
  let task = {
    updateOne: {
      filter: {
        _id: product?._id,
        "colors.color": color?._id,
        "colors.sizes.size": size?._id,
      },
      update: {
        $inc: {
          "colors.$[colorElem].sizes.$[sizeElem].stock": -quantity,
        },
      },
      arrayFilters: [
        { "colorElem.color": color?._id },
        { "sizeElem.size": size?._id },
      ],
    },
  };
  if (bulkOperations?.clothes) {
    bulkOperations.clothes.tasks.push(task);
  } else {
    bulkOperations.clothes = {
      model: ClothesModel,
      tasks: [task],
    };
  }
  return true;
};
const decorCase = ({
  product,
  color,
  quantity,
  bulkOperations,
  orderItems,
}) => {
  const colorMatch = product?.colors?.find((c) =>
    c?.color?._id.equals(color?._id)
  );
  if (!product?._id || !colorMatch || colorMatch?.stock < quantity) return false;
  // Add formatted order item to list
  orderItems.push({
    original_id: product?._id,
    name: product?.name,
    price: product?.price,
    discount: product?.discount,
    quantity,
    poster: product?.poster?.url,
    type: product?.type,
    selectedOptions: {
      color: {
        original_id: colorMatch?.color?._id,
        name: colorMatch?.color?.name,
        code: colorMatch?.color?.code,
      },
    },
  });
  let task = {
    updateOne: {
      filter: {
        _id: product?._id,
        "colors.color": color?._id,
      },
      update: {
        $inc: {
          "colors.$.stock": -quantity,
        },
      },
    },
  };
  if (bulkOperations?.decor) {
    bulkOperations.decor.tasks.push(task);
  } else {
    bulkOperations.decor = {
      model: DecorModel,
      tasks: [task],
    };
  }
  return true;
};
export const allProductTypes = {
  decor: {
    name: "decor",
    model: DecorModel,
    orderhelper: decorCase,
  },
  clothes: {
    name: "clothes",
    model: ClothesModel,
    orderhelper: ClothesCase,
  },
};
export const UpdateStockProducts = async (bulkOperation) => {
  Object?.keys(bulkOperation)?.forEach(async (type) => {
    try {
      let { model, tasks } = bulkOperation?.[type];
      await model.bulkWrite(tasks);
    } catch (error) {
      console.error(`Error while bulk writing ${type} products:`, error);
    }
  });
};
