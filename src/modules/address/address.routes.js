import express from 'express';

import { validation } from '../../middleware/validation.js';
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js';
import { addToAddress, getLoggedAddress, removeFromAddress } from './address.controller.js';
import { addAddressVal, paramsIdVal } from './address.validation.js';

const addressRouter = express.Router();

addressRouter
.route('/')
.patch(protectedRoutes, allowedTo('user'),validation(addAddressVal), addToAddress)
.get(protectedRoutes, allowedTo('user'),getLoggedAddress)

addressRouter
.route('/:id')
.delete(protectedRoutes, allowedTo('user','admin'), validation(paramsIdVal), removeFromAddress)

export default addressRouter;