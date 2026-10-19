import express from 'express';
import authController from '../controllers/authController.js';

const router = express.Router();

router.get("/", authController.showLogin);

router.get("/testdata", authController.testData);

router.post("/login", authController.login);

router.get("/logout", authController.logout);

export default router;