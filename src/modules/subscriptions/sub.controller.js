import subscriptionService from "./sub.service.js";

class SubscriptionController {
  async create(req, res, next) {
    try {
      const {
        service_name,
        category,
        cost,
        billing_cycle,
        auto_renews,
        start_date,
      } = req.body;
      const userId = req.user.id;

      // Calculate annualized cost
      let annualized_cost = cost;
      if (billing_cycle === "Monthly") {
        annualized_cost = cost * 12;
      } else if (billing_cycle === "Quarterly") {
        annualized_cost = cost * 4;
      }

      const subscription = await subscriptionService.create({
        service_name,
        category,
        cost,
        billing_cycle,
        auto_renews,
        start_date,
        annualized_cost,
        userId,
      });

      res.status(201).json({
        message: "Subscription created successfully",
        data: subscription,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const userId = req.user.id;
      const subscriptions = await subscriptionService.getAll(userId);
      res.json({
        message: "Subscriptions fetched successfully",
        data: subscriptions,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const updates = req.body;
      const userId = req.user.id;

      // Recalculate annualized cost if billing cycle or cost changes
      if (updates.cost || updates.billing_cycle) {
        const cost = updates.cost || req.body.cost;
        const billing_cycle = updates.billing_cycle || req.body.billing_cycle;

        if (cost && billing_cycle) {
          let annualized_cost = cost;
          if (billing_cycle === "Monthly") {
            annualized_cost = cost * 12;
          } else if (billing_cycle === "Quarterly") {
            annualized_cost = cost * 4;
          }
          updates.annualized_cost = annualized_cost;
        }
      }

      const subscription = await subscriptionService.update(
        id,
        updates,
        userId
      );
      res.json({
        message: "Subscription updated successfully",
        data: subscription,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      await subscriptionService.delete(id, userId);
      res.json({
        message: "Subscription deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new SubscriptionController();
