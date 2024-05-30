import express from 'express';
import {  createOrderVal } from './order.validation.js';
import { validation } from '../../middleware/validation.js';
import { createCashOrder, createCheckoutSession, getAllOrders, getSpecificOrder } from './order.controller.js';
import { authorized } from '../../middleware/authorized.js';
import { protectedRoutes } from '../../middleware/auth/protectedRoutes.js';


const orderRouter = express.Router();

orderRouter.route('/').get(protectedRoutes, authorized('user'), getSpecificOrder)

orderRouter.get('/all', protectedRoutes, authorized('admin'), getAllOrders)

orderRouter.route('/:id')
.post(protectedRoutes, authorized('user'), validation(createOrderVal), createCashOrder)

orderRouter.post("/checkOut/:id", protectedRoutes, authorized('user'), createCheckoutSession)

export default orderRouter;