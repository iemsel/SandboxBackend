const express = require("express");
const router = express.Router();
const plansController = require("../controllers/plans.controller");
const { authRequired } = require("../middleware/auth");

// All planner endpoints are protected
router.get("/plans", authRequired, plansController.listPlans);
router.post("/plans", authRequired, plansController.createPlan);
router.get("/plans/:id", authRequired, plansController.getPlan);
router.delete("/plans/:id", authRequired, plansController.deletePlan);

router.post("/plans/:id/items", authRequired, plansController.addPlanItem);
router.delete(
  "/plans/:planId/items/:itemId",
  authRequired,
  plansController.deletePlanItem
);

module.exports = router;
