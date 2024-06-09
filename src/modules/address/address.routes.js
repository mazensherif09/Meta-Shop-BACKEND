import express from 'express';
import { validation } from '../../middleware/globels/validation.js';
import { addToAddress, getLoggedAddress, removeFromAddress } from './address.controller.js';
import { addAddressVal, paramsIdVal } from './address.validation.js';
import { protectedRoutes } from '../../middleware/auth/protectedRoutes.js';

const addressRouter = express.Router();

addressRouter
.route('/')
.patch(protectedRoutes,validation(addAddressVal), addToAddress)
.get(protectedRoutes,getLoggedAddress)

addressRouter
.route('/:id')
.delete(protectedRoutes,  validation(paramsIdVal), removeFromAddress)

export default addressRouter;