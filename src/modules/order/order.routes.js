import express from 'express';
import {  createOrderVal } from './order.validation.js';
import { validation } from '../../middleware/globels/validation.js';
import { createCashOrder, createCheckoutSession, getAllOrders, getSpecificOrder } from './order.controller.js';

import { protectedRoutes } from '../../middleware/auth/protectedRoutes.js';


const orderRouter = express.Router();

orderRouter.route('/').get(protectedRoutes, getSpecificOrder)

orderRouter.get('/all', protectedRoutes, getAllOrders)

orderRouter.route('/:id').post(protectedRoutes, createCashOrder)

orderRouter.post("/checkOut/:id", protectedRoutes, createCheckoutSession)

export default orderRouter;