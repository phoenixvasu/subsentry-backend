// src/modules/metrics/metrics.controller.js
import { getMetrics as serviceGetMetrics } from "./metrics.service.js";
import { ApplicationError } from "../../utils/errors.js";

export const getMetrics = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const metrics = await serviceGetMetrics(userId);
    res.json(metrics);
  } catch (error) {
    next(error);
  }
};
