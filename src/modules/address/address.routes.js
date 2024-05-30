import express from 'express';
import { validation } from '../../middleware/validation.js';
import { addToAddress, getLoggedAddress, removeFromAddress } from './address.controller.js';
import { addAddressVal, paramsIdVal } from './address.validation.js';
import { protectedRoutes } from '../../middleware/auth/protectedRoutes.js';
import { authorized } from '../../middleware/authorized.js';

const addressRouter = express.Router();

addressRouter
.route('/')
.patch(protectedRoutes, authorized('user'),validation(addAddressVal), addToAddress)
.get(protectedRoutes, authorized('user'),getLoggedAddress)

addressRouter
.route('/:id')
.delete(protectedRoutes, authorized('user','admin'), validation(paramsIdVal), removeFromAddress)

export default addressRouter;