import { cartModel } from "../../../database/models/cart.model.js";
import { couponhistoryModel } from "../../../database/models/coupon_history.js";
import { orderModel } from "../../../database/models/order.model.js";
import { influencerModel } from "../../../database/models/influencer.model.js";
import { AsyncHandler } from "../../middleware/globels/AsyncHandler.js";
import { AppError } from "../../utils/AppError.js";
import { UpdateStockProducts } from "../product/product.services.js";
import { FindAll } from "./../handlers/crudHandler.js";

// const createCashOrder = AsyncHandler(async (req, res, next) => {
//   const { user = {} } = req;
//   const { cart = {} } = user; // cart is populated with user
//   // 1:2 Handle error cases
//   if (!cart || !cart?.items?.length) {
//     return next(
//       new AppError({
//         message: "Cart is empty",
//         code: 400,
//         details: { cart: [] },
//       })
//     );
//   }

//   // 2:1 Check if order has coupon for discount and check if used before with same user
//   let coupon = null;
//   if (req.body.coupon) {
//     const findCoupon = await FindCouponWithVerfiy({
//       filters: {
//         _id: { $eq: req.body.coupon },
//       },
//       user,
//     });
//     coupon = {
//       original_id: findCoupon._id,
//       code: findCoupon.code,
//       discount: findCoupon?.discount,
//     };
//   }

//   // 3:1 Check product availability and calculate total order price
//   let totalOrderPrice = 0;
//   const orderItems = [];
//   const bulkOperations = { decor: [], clothes: [] };

//   for (const item of cart.items) {
//     const { product, color, size, quantity } = item;
//     const productType = product.type; // Assuming product type is used to determine schema

//     // Check product availability
//     const colorMatch = product.colors.find((c) =>
//       c.color._id.equals(color._id)
//     );
//     const sizeMatch = colorMatch?.sizes.find((s) =>
//       s.size._id.equals(size._id)
//     );

//     if (
//       !product._id ||
//       !colorMatch ||
//       !sizeMatch ||
//       sizeMatch.stock < quantity
//     ) {
//       return next(
//         new AppError({
//           message: `Some products are out of stock`,
//           code: 400,
//           details: { cart: [...cart.items] },
//         })
//       );
//     }

//     // Calculate order item price and add to total order price
//     const itemPrice = product.price * quantity;
//     totalOrderPrice += itemPrice;

//     // Add formatted order item to list
//     orderItems.push({
//       original_id: product._id,
//       name: product.name,
//       price: product.price,
//       discount: product.discount,
//       quantity: item.quantity,
//       poster: product.poster.url,
//       size: {
//         original_id: sizeMatch.size,
//         name: sizeMatch.size.name,
//       },
//       color: {
//         original_id: colorMatch.color,
//         name: colorMatch.color.name,
//         code: colorMatch.color.code,
//       },
//     });

//     // Prepare bulk operations based on product type
//     if (productType === "clothes") {
//       bulkOperations.clothes.push({
//         updateOne: {
//           filter: {
//             _id: product._id,
//             "colors.color": color._id,
//             "colors.sizes.size": size._id,
//           },
//           update: {
//             $inc: {
//               "colors.$[colorElem].sizes.$[sizeElem].stock": -quantity,
//             },
//           },
//           arrayFilters: [
//             { "colorElem.color": color._id },
//             { "sizeElem.size": size._id },
//           ],
//         },
//       });
//     } else if (productType === "decor") {
//       bulkOperations.decor.push({
//         updateOne: {
//           filter: {
//             _id: product._id,
//             "colors.color": color._id,
//           },
//           update: {
//             $inc: {
//               "colors.$[colorElem].stock": -quantity,
//             },
//           },
//           arrayFilters: [{ "colorElem.color": color._id }],
//         },
//       });
//     }
//   }

//   // 4:1 Format order before creating record
//   let orderObject = {
//     user: user._id,
//     orderItems,
//     totalOrderPrice,
//     shippingAddress: req.body?.shippingAddress,
//     paymentType: "cash",
//   };

//   // 4:2 Check if order has coupon and add coupon details if it has
//   if (coupon?.discount) {
//     orderObject.discount = coupon?.discount;
//     orderObject.coupon = coupon;
//     orderObject.totalOrderPrice -= totalOrderPrice * (coupon?.discount / 100);
//   }

//   // 4:3 Create order document in the database
//   let order = new orderModel(orderObject);
//   await order.save();

//   // 4:4 Add new record to coupon history if order has coupon
//   if (coupon) {
//     const couponHistory = new couponhistoryModel({
//       user: user._id,
//       coupon: coupon._id,
//     });
//     await couponHistory.save();
//   }
//   // 4:5 Update product quantities and sold count
//   if (bulkOperations.clothes.length) {
//     await ClothesModel.bulkWrite(bulkOperations.clothes);
//   }
//   if (bulkOperations.decor.length) {
//     await DecorModel.bulkWrite(bulkOperations.decor);
//   }

//   // 5: Clear cart
//   await cartModel.findByIdAndUpdate(cart._id, { items: [] });

//   // 6: Send email to user with order details (optional || production mode)
//   // const emailData = {
//   //   recipient: user.email,
//   //   subject: "Your Order",
//   //   req.body: `Your order has been placed successfully. Order ID: ${order._id}`,
//   // };
//   // await sendEmail(emailData);

//   // 7: Return success message with order details
//   return res.json({
//     message: "Order placed successfully",
//     data: order,
//   });
// });
const createOrder = AsyncHandler(async (req, res, next) => {
  const { order, bulkOperations } = req.order;
  console.log("🚀 ~ createOrder ~ order:", order);

  // Update stock products
  await UpdateStockProducts(bulkOperations);

  // Handle order creation
  let newOrder = new orderModel({
    ...order,
    coupon: order.coupon, // Pass the full coupon object
  });
  await newOrder.save();

  // Handle coupon usage
  if (order.coupon) {
    let newCouponRecord = new couponhistoryModel({
      user: order.user,
      coupon: order.coupon.original_id, // Store only ObjectId
    });
    await newCouponRecord.save();

    // Find the influencer based on coupon reference
    const influencer = await influencerModel.findOne({
      coupon: order.coupon.original_id,
    });

    if (influencer) {
      // Calculate discount amount and update influencer earnings
      const discountAmount =
        order.totalOrderPrice * (order.coupon.discount / 100);
      await influencerModel.findByIdAndUpdate(influencer._id, {
        $inc: { totalEarned: discountAmount },
      });
    }
  }

  // Handle clear cart
  await cartModel.findByIdAndUpdate(req?.user?.cart?._id, { items: [] });

  return res.status(201).json({
    message: "Order created successfully",
  });
});

const getSpecificOrder = AsyncHandler(async (req, res, next) => {
  let user = req.user;
  const isAdmin = user.role === "admin";
  let order = await orderModel
    .findById(req.params.id)
    .populate("user", "fullName");
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
const getAllOrders = FindAll({
  model: orderModel,
  customFiltersFN: (req) => {
    let user = req.user;
    const isAdmin = user.role === "admin";
    return {
      ...(isAdmin
        ? {}
        : {
            user: user._id,
          }),
    };
  },
});
export { createOrder, getSpecificOrder, getAllOrders };
