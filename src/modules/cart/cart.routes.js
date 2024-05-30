import express from 'express';
import { addToCart, applyCoupon, clearUserCart, getLoggedCart, removeItemCart, updateQTY } from './cart.controller.js';
import { addCartVal, paramsIdVal, updateQTYVal } from './cart.validation.js';
import { validation } from '../../middleware/validation.js';
import { authorized } from '../../middleware/authorized.js';
import { protectedRoutes } from '../../middleware/auth/protectedRoutes.js';
import { userRoles } from '../../assets/userRoles.js';



const cartRouter = express.Router();


cartRouter
.route('/')
.post(protectedRoutes, authorized(userRoles.User), validation(addCartVal), addToCart)
.get(protectedRoutes, authorized(userRoles.User), getLoggedCart)
.delete(protectedRoutes, authorized(userRoles.User), clearUserCart)

cartRouter.post('/applycoupon', protectedRoutes, authorized(userRoles.User), applyCoupon)

cartRouter
.route('/:id')
// .get(validation(paramsIdVal), getSingleCategory)
.put(protectedRoutes, authorized(userRoles.User), validation(updateQTYVal), updateQTY)
.delete(protectedRoutes, authorized(userRoles.User), validation(paramsIdVal), removeItemCart)

export default cartRouter;