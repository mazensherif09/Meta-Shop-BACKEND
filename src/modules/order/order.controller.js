import { cartModel } from "../../../database/models/cart.model.js";
import { orderModel } from "../../../database/models/order.model.js";
import { productModel } from "../../../database/models/product.model.js";
import { AsyncHandler } from "../../middleware/globels/AsyncHandler.js";
import { AppError } from "../../utils/AppError.js";
import { FindCouponWithVerfiy } from "../coupon/coupon.services.js";

const createCashOrder = AsyncHandler(async (req, res, next) => {
  let { cart } = req.user; // cart is populated with user
  // 1:2  handle error cases
  if (!cart || !cart?.items?.length)
    return next(
      new AppError({
        message: "Cart is empty",
        code: 400,
        details: { cart: [] },
      })
    );
  // 2:1 cheack is order has coupon for discount and chack is used before with same user
  let coupon = null;
  if (req.body.coupon) {
    const findCoupon = await FindCouponWithVerfiy({
      filters: {
        _id: { $eq: req.body.coupon },
      },
      user,
    });
    coupon = {
      original_id: findCoupon._id,
      code: findCoupon.code,
      discount: findCoupon.discount,
    };
  }
  // 3:1 Check product availability and calculate total order price
  let totalOrderPrice = 0;
  const orderItems = [];
  const bulkUpdateOperations = [];
  for (const item of cart.items) {
    const product = item.product;
    // check product availability
    const colorMatch = product.colors.find((color) =>
      color.color._id.equals(item.color._id)
    );
    const sizeMatch = colorMatch.sizes.find((size) =>
      size.size._id.equals(item.size._id)
    );
    if (
      !product._id ||
      !colorMatch ||
      !sizeMatch ||
      sizeMatch?.stock < item.quantity
    ) {
      return next(
        new AppError({
          message: `some of products is out of stock`,
          code: 400,
          details: { cart: [...cart?.items] },
        })
      );
    }
    // Calculate order item price and add to total order price
    const itemPrice = product.price * item.quantity;
    //handle discount
    totalOrderPrice += itemPrice;
    // Add formatted order item to list
    orderItems.push({
      original_id: product._id,
      name: product.name,
      price: product.price,
      discount: product.discount,
      quantity: item.quantity,
      poster: product.poster.url,
      size: {
        original_id: sizeMatch.size,
        name: sizeMatch.size.name,
      },
      color: {
        original_id: colorMatch.color,
        name: colorMatch.color.name,
        code: colorMatch.color.code,
      },
    });
    // update bulk write to subtract quantity from product
    bulkUpdateOperations.push({
      updateOne: {
        filter: {
          _id: item.product._id,
          "colors.color": item.color._id,
          "colors.sizes.size": item.size._id,
        },
        update: {
          $inc: {
            "colors.$[colorElem].sizes.$[sizeElem].stock": -item.quantity,
            "colors.$[colorElem].sizes.$[sizeElem].sold": item.quantity,
          },
        },
        arrayFilters: [
          { "colorElem.color": item.color._id },
          { "sizeElem.size": item.size._id },
        ],
      },
    });
  }
  // 4:1 format order before make record
  let orderObject = {
    user: user._id,
    orderItems,
    totalOrderPrice,
    shippingAddress: req.body?.shippingAddress,
    paymentType: "cash",
  };
  // 4:2 check is order has coupon and add coupon details if it has
  if (coupon.discount) {
    orderObject.discount = coupon.discount;
    orderObject.coupon = coupon;
    orderObject.totalOrderPrice =
      totalOrderPrice - totalOrderPrice * (coupon.discount / 100);
  }
  // 4:3 Create order document in the database
  let order = new orderModel(orderObject);
  await order.save();
  // 4:4 add new record to coupon history if order is has coupon
  if (coupon) {
    const couponHistory = new couponhistoryModel({
      user: user._id,
      coupon: coupon._id,
    });
    await couponHistory.save();
  }
  // 4:5 Update product quantities and sold count
  await productModel.bulkWrite(bulkUpdateOperations);
  // 5. Clear cart
  await cartModel.findByIdAndUpdate(cart._id, { items: [] });
  // 6: Send email to user with order details (optional || production mode)
  // const emailData = {
  //   recipient: user.email,
  //   subject: "Your Order",
  //   req.body: `Your order has been placed successfully. Order ID: ${order._id}`,
  // };
  // await sendEmail(emailData);
  // 7: Return success message with order details
  return res.json({
    message: "Order placed successfully",
    data: order,
  });
});
const getSpecificOrder = AsyncHandler(async (req, res, next) => {
  let user = req.user;
  const isAdmin = user.role === "admin";
  let order = await orderModel.findById(params.id).populate("user", "fullName");
  let checker = order?.user?.toString() !== user._id.toString() && !isAdmin;
  if (!order || checker) {
    return next(new AppError({ message: "Order not found", code: 404 }));
  }
  if (!order)
    return next(
      new AppError({
        message: "not found order",
        code: 404,
      })
    );

  return res.json(order);
});
const getAllOrders = AsyncHandler(async (req, res, next) => {
  let user = req.user;
  const isAdmin = user.role === "admin";
  let orders = await orderModel
    .find({
      ...(isAdmin
        ? {
            user: user._id,
          }
        : {}),
    })
    .populate("user", "fullName");

  return res.json(orders || []);
});

export { createCashOrder, getSpecificOrder, getAllOrders };
