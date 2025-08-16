const subService = require('./sub.service');
const { ApplicationError } = require('../../utils/errors');

const createSubscription = async (req, res, next) => {
  try {
    const userId = req.user.sub;
    const subscription = await subService.createSubscription(userId, req.body);
    res.status(201).json(subscription);
  } catch (error) {
    next(error);
  }
};

const updateSubscription = async (req, res, next) => {
  try {
    const userId = req.user.sub;
    const { id } = req.params;
    const subscription = await subService.updateSubscription(parseInt(id), userId, req.body);
    res.status(200).json(subscription);
  } catch (error) {
    next(error);
  }
};

const deleteSubscription = async (req, res, next) => {
  try {
    const userId = req.user.sub;
    const { id } = req.params;
    const result = await subService.deleteSubscription(parseInt(id), userId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getSubscriptionById = async (req, res, next) => {
  try {
    const userId = req.user.sub;
    const { id } = req.params;
    const subscription = await subService.getSubscriptionById(parseInt(id), userId);
    res.status(200).json(subscription);
  } catch (error) {
    next(error);
  }
};

const listSubscriptions = async (req, res, next) => {
  try {
    const userId = req.user.sub;
    const subscriptions = await subService.listSubscriptions(userId, req.query);
    res.status(200).json(subscriptions);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSubscription,
  updateSubscription,
  deleteSubscription,
  getSubscriptionById,
  listSubscriptions,
};