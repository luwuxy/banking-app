import express from 'express';
import customerController from '../controllers/customerController.js';
import { requireCustomer } from '../middleware/auth.js';

const router = express.Router();

router.get("/", requireCustomer, customerController.dashboard);

router.post("/deposit", requireCustomer, customerController.deposit);

router.post("/withdraw", requireCustomer, customerController.withdraw);

export default router;