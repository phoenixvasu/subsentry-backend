// src/modules/renewals/renewals.route.js
const express = require('express');
const renewalsController = require('./renewals.controller');
const { protect } = require('../../middleware/auth'); // Assuming auth middleware is here

const router = express.Router();

router.get('/', protect, renewalsController.getUpcomingRenewals);

module.exports = router;