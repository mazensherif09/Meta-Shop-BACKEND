import jwt from "jsonwebtoken";
import { cartModel } from "../../../database/models/cart.model.js";
import { productModel } from "../../../database/models/product.model.js";

const handleMerageCartItems = (items1 = [], items2 = []) => {
  const combinedItems = [...items1, ...items2];
  const uniqueItems = [];

  combinedItems.forEach((item) => {
    const duplicateItem = uniqueItems.find(
      (uniqueItem) =>
        uniqueItem.product?._id?.toString() === item.product?._id?.toString() &&
        uniqueItem.color?._id?.toString() === item.color?._id?.toString() &&
        uniqueItem.size?._id?.toString() === item.size?._id?.toString()
    );

    if (duplicateItem) {
      duplicateItem.quantity += item.quantity;
    } else {
      uniqueItems.push({ ...item });
    }
  });

  return uniqueItems;
};
const handleproductIsAvailable = async (items) => {
  if (!items || items.length === 0) return [];

  const productIds = items.map((item) => item.product?._id);
  const products = await productModel.find({ _id: { $in: productIds } });

  return items.map((item) => {
    const product = products.find((product) =>
      product._id.equals(item.product._id)
    );
    return product ? { ...item, product } : item;
  });
};
const handleConnectCart = async (cart, req, res) => {
  if (req.cookies.cart) {
    try {
      const decoded = jwt.verify(req.cookies.cart, process.env.SECRETKEY);
      if (decoded?.cart) {
        const localCart = await cartModel.findByIdAndDelete(decoded.cart, {
          new: true,
        });
        if (localCart) {
          const localItems = await handleproductIsAvailable(localCart.items);
          cart.items = handleMerageCartItems(localItems, cart?.items);
          await cartModel.findByIdAndUpdate(cart._id, {
            items: cart.items,
            user: req.user?._id,
          });
          res.cookie("cart", "", {
            maxAge: 0,
            httpOnly: true,
          });
        }
      }
    } catch (err) {
      console.error("Error handling cart connection:", err);
    }
  }
  return cart;
};
const handleCartSignIn = async (user, req, res) => {
  let cart = null;
  if (req.cookies.cart) {
    try {
      const decoded = jwt.verify(req.cookies.cart, process.env.SECRETKEY);
      cart = cartModel.findByIdAndUpdate(
        decoded?.cart,
        { user: user._id },
        { new: true }
      );
      res.cookie("cart", "", {
        maxAge: 0,
        httpOnly: true,
      });
    } catch (error) {}
  }
  if (!cart) {
    cart = await cartModel.create({ user });
  }
  return cart;
};

export { handleConnectCart, handleCartSignIn };
