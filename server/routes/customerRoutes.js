import express from 'express';
import customerController from '../controllers/customerController.js';
import { requireCustomer } from '../middleware/auth';
import router from './adminRoutes.js';

router.get("/", requireCustomer, customerController.dashboard);

router.post("/deposit", requireCustomer, customerController.deposit);

router.post("/withdraw", requireCustomer, customerController.withdraw);

export default router;