import { productModel } from "../../../database/models/product.model.js";

export const handleMerageCartItems = (item1, item2) => {
  let array = [...item1, ...item2];
  array.forEach((val, ind) => {
    let isDeublicated = array.find(
      (val2, ind2) => val?.product?._id === val2?.product?._id && ind !== ind2
    );
    if (isDeublicated) {
      isDeublicated.quantity += val?.quantity;
      array.splice(ind, 1);
    }
  });

  array.forEach((val, ind) => {
    val.product = val?.product?._id || null;
    delete val["_id"];
  });
  return array;
};
export const handleproductIsAvailable = async (items) => {
  const entries = await productModel.findMany({
    filters: { _id: { $in: items.map((val) => val.product?._id) } },
  });
  items.forEach((val, ind) => {
    const product = entries.find((val2) => val?.product?._id === val2?._id);
    if (product) {
      val.product = product;
    } else {
      val.product = null;
    }
  });
  return items;
};
