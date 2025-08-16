import express from "express";
import { requireAuth } from "../../middleware/auth.js";
import subscriptionController from "./sub.controller.js";

const router = express.Router();

// All subscription routes require authentication
router.use(requireAuth);

router.post("/", subscriptionController.create);
router.get("/", subscriptionController.getAll);
router.get("/:id", subscriptionController.getById);
router.put("/:id", subscriptionController.update);
router.delete("/:id", subscriptionController.delete);

export default router;
