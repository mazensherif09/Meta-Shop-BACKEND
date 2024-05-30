import express from 'express';
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js';
import { addToCart, applyCoupon, clearUserCart, getLoggedCart, removeItemCart, updateQTY } from './cart.controller.js';
import { addCartVal, paramsIdVal, updateQTYVal } from './cart.validation.js';
import { validation } from '../../middleware/validation.js';



const cartRouter = express.Router();


cartRouter
.route('/')
.post(protectedRoutes, allowedTo('user'), validation(addCartVal), addToCart)
.get(protectedRoutes, allowedTo('user'), getLoggedCart)
.delete(protectedRoutes, allowedTo('user'), clearUserCart)

cartRouter.post('/applycoupon', protectedRoutes, allowedTo('user'), applyCoupon)

cartRouter
.route('/:id')
// .get(validation(paramsIdVal), getSingleCategory)
.put(protectedRoutes, allowedTo('user'), validation(updateQTYVal), updateQTY)
.delete(protectedRoutes, allowedTo('user', 'admin'), validation(paramsIdVal), removeItemCart)

export default cartRouter;