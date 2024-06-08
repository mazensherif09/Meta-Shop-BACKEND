import express from 'express';
import { addToCart, applyCoupon, clearCart, getLoggedCart, removeItemCart,  } from './cart.controller.js';
import { addCartVal, paramsIdVal,  } from './cart.validation.js';
import { validation } from '../../middleware/globels/validation.js';
import { protectedRoutes } from '../../middleware/auth/protectedRoutes.js';
import { protectedRoutesCart } from '../../middleware/cart/protectedRoutesCart.js';




const cartRouter = express.Router();


cartRouter
.route('/')
.post(protectedRoutesCart, validation(addCartVal), addToCart)
.get(protectedRoutesCart, getLoggedCart)
.delete(protectedRoutesCart, clearCart)

cartRouter.post('/applycoupon', protectedRoutes, applyCoupon)

cartRouter
.route('/:id')
.delete(protectedRoutesCart, validation(paramsIdVal), removeItemCart)

export default cartRouter;