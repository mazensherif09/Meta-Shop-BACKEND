import express from 'express';
import { addToCart, applyCoupon, clearUserCart, getLoggedCart, removeItemCart, updateQTY } from './cart.controller.js';
import { addCartVal, paramsIdVal, updateQTYVal } from './cart.validation.js';
import { validation } from '../../middleware/validation.js';
import { authorized } from '../../middleware/authorized.js';
import { protectedRoutes } from '../../middleware/auth/protectedRoutes.js';



const cartRouter = express.Router();


cartRouter
.route('/')
.post(protectedRoutes, authorized('user'), validation(addCartVal), addToCart)
.get(protectedRoutes, authorized('user'), getLoggedCart)
.delete(protectedRoutes, authorized('user'), clearUserCart)

cartRouter.post('/applycoupon', protectedRoutes, authorized('user'), applyCoupon)

cartRouter
.route('/:id')
// .get(validation(paramsIdVal), getSingleCategory)
.put(protectedRoutes, authorized('user'), validation(updateQTYVal), updateQTY)
.delete(protectedRoutes, authorized('user', 'admin'), validation(paramsIdVal), removeItemCart)

export default cartRouter;