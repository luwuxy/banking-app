import express from 'express';
import authController from '../controllers/authController.js';

const router = express.Router();

router.get("/", authController.showLogin);

router.post("/login", authController.login);

router.get("/logout", authController.logout);

router.post("/register", authController.register);

export default router;