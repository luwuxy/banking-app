import express from 'express';
import adminController from '../controllers/adminController.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get("/", requireAdmin, adminController.dashboard);
router.get("/create", requireAdmin, adminController.showCreateCustomer);
router.post("/create", requireAdmin, adminController.createCustomer);

export default router;