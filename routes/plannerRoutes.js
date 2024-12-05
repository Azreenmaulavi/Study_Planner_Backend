const express = require("express");
const router = express.Router();
const { fetchUser } = require("../Middleware/fetchUser");
const {
  createPlanner,
  updatePlanner,
  deletePlanner,
  getPlanners
} = require("../controllers/plannerController");

const {verifyToken}= require("../middleware/verifyToken")

// Planner Routes
router.post("/create", verifyToken,fetchUser, createPlanner);
router.put("/update/:id",verifyToken, fetchUser,  updatePlanner);
router.delete("/delete/:id",verifyToken, fetchUser, deletePlanner);
router.get("/getAllPlanners",verifyToken, fetchUser, getPlanners);

module.exports = router;
