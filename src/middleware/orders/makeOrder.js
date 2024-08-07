import { FindCouponWithVerfiy } from "../../modules/coupon/coupon.services.js";
import { allProductTypes } from "../../modules/product/product.services.js";
import { AppError } from "../../utils/AppError.js";
import { AsyncHandler } from "../globels/AsyncHandler.js";

export const makeOrder = AsyncHandler(async (req, res, next) => {
  const { user = {} } = req;
  const { cart = {} } = user; // cart is populated with user

  // Handle error cases
  if (!cart || !cart?.items?.length) {
    return next(
      new AppError({
        message: "Cart is empty",
        code: 400,
        details: { cart: [] },
      })
    );
  }

  // Handle verify coupon
  let coupon = null;
  if (req.body.coupon) {
    const findCoupon = await FindCouponWithVerfiy({
      filters: {
        code: { $eq: req.body.coupon.code },
      },
      user,
    });
    coupon = {
      original_id: findCoupon._id,
      code: findCoupon.code,
      discount: findCoupon?.discount,
    };
  }

  let totalOrderPrice = 0;
  const orderItems = [];
  const bulkOperations = {};
  const onError = () => {
    return next(
      new AppError({
        message: "Some products are not available",
        code: 400,
        details: {
          cart: [...cart.items],
        },
      })
    );
  };

  cart?.items?.forEach((item) => {
    const { product, quantity } = item;
    let configForThisType = allProductTypes?.[product?.type];
    if (!configForThisType) return onError();
    const isValid = configForThisType.orderhelper({
      ...item,
      cart,
      orderItems,
      bulkOperations,
    });
    if (!isValid) return onError();
    // Calculate order item price and add to total order price
    const itemPrice = product?.price * quantity;
    totalOrderPrice += itemPrice;
  });

  let order = {
    user: user._id,
    orderItems,
    totalOrderPrice,
    shippingAddress: {
      ...req?.body?.shippingAddress,
    },
    paymentType: "cash",
  };
  if (coupon) {
    order.discount = coupon?.discount;
    order.coupon = coupon; // Pass the full coupon object
    order.totalOrderPrice -= totalOrderPrice * (coupon?.discount / 100);
  }
  req.order = {
    order,
    bulkOperations,
  };

  return next();
});
