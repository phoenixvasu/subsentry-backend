import express from "express";
import { requireAuth } from "../../middleware/auth.js";
import { getUpcomingRenewals } from "./renewals.controller.js";

const router = express.Router();

// All renewals routes require authentication
router.use(requireAuth);

router.get("/", getUpcomingRenewals);

export default router;
