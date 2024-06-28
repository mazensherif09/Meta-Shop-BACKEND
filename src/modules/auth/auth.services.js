import jwt from "jsonwebtoken";
import { cartModel } from "../../../database/models/cart.model.js";
import { productModel } from "../../../database/models/product.model.js";
import { AppError } from "../../utils/AppError.js";


const handleMerageCartItems = (items1 = [], items2 = []) => {
  let array = [...items1, ...items2];
  array.forEach((val, ind) => {
    let isDeublicated = array.find(
      (val2, ind2) =>
        val?.product?._id.toString() === val2?.product?._id.toString() &&
        val?.color?._id.toString() === val2?.color?._id.toString() &&
        val?.size?._id.toString() === val2?.size?._id.toString() &&
        ind !== ind2
    );
    if (isDeublicated) {
      isDeublicated.quantity += val?.quantity;
      array.splice(ind, 1);
    }
  });

  array.forEach((val, ind) => {
    // val.product = val?.product?.id || null;
    delete val["_id"];
  });

  return array;
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
const handleConnectCart = async (user, req, res) => {
  let cart = user?.cart;
  if (req.cookies.cart) {
    try {
      const decoded = jwt.verify(req.cookies.cart, process.env.SECRETKEY);
      if (decoded?.cart) {
        const localCart = await cartModel.findByIdAndDelete(decoded.cart, {
          new: true,
        });
        if (localCart) {
          cart = await cartModel.findByIdAndUpdate(
            cart?._id,
            {
              items: handleMerageCartItems(localCart?.items, cart?.items),
              user,
            },
            {
              new: true,
            }
          );
          res.cookie("cart", "", {
            maxAge: 0,
            httpOnly: true, // accessible only by web server
            secure: process.env === 'pro', // send only over HTTPS
            // domain: process.env.DOMAIN, // parent domain to include subdomains
            sameSite: 'None', // necessary for cross-site cookies
          });
          return cart;
        }
      }
    } catch (err) {
     return next(new AppError(`Error handling cart connection`, 401));
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
        httpOnly: true, // accessible only by web server
        secure: process.env === 'pro', // send only over HTTPS
        // domain: process.env.DOMAIN, // parent domain to include subdomains
        sameSite: 'None', // necessary for cross-site cookies
      });
    } catch (error) {}
  }
  if (!cart) {
    cart = await cartModel.create({ user });
  }
  return cart;
};

export { handleConnectCart, handleCartSignIn };
