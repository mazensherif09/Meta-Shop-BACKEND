import express from 'express';
import {  createOrderVal } from './order.validation.js';
import { validation } from '../../middleware/globels/validation.js';
import { createCashOrder, createCheckoutSession, getAllOrders, getSpecificOrder } from './order.controller.js';
import { authorized } from '../../middleware/globels/authorized.js';
import { protectedRoutes } from '../../middleware/auth/protectedRoutes.js';
import { userRoles } from '../../assets/userRoles.js';


const orderRouter = express.Router();

orderRouter.route('/').get(protectedRoutes, authorized(userRoles.User), getSpecificOrder)

orderRouter.get('/all', protectedRoutes, authorized(userRoles.Admin, userRoles.Super_admin), getAllOrders)

orderRouter.route('/:id')
.post(protectedRoutes, authorized(userRoles.User), validation(createOrderVal), createCashOrder)

orderRouter.post("/checkOut/:id", protectedRoutes, authorized(userRoles.User), createCheckoutSession)

export default orderRouter;