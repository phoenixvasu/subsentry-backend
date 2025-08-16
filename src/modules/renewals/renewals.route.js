import express from "express";
import { requireAuth } from "../../middleware/auth.js";
import { getUpcomingRenewals } from "./renewals.service.js";

const router = express.Router();

// All renewals routes require authentication
router.use(requireAuth);

router.get("/", async (req, res, next) => {
  try {
    const renewals = await getUpcomingRenewals(req.user.id, 30); // Next 30 days
    res.json(renewals);
  } catch (error) {
    next(error);
  }
});

export default router;
