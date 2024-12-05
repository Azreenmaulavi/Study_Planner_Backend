const express = require("express");
const router = express.Router();
const { fetchUser } = require("../Middleware/fetchUser");
const {
  getUserProgress,
   updateProgressOnCompletion,
   getWeeklyProgress,
   getTasksForProgressTracker,
   resetUserProgress
} = require("../controllers/progressController");
const { verifyToken } = require("../middleware/verifyToken");


router.get("/:userId/progress",verifyToken,fetchUser, getUserProgress);
router.get('/tasks/progress/:userId', verifyToken,fetchUser, getTasksForProgressTracker);
router.get('/progress/reset/:userId', verifyToken,fetchUser,resetUserProgress);
router.put("/:taskId/complete",verifyToken,fetchUser, updateProgressOnCompletion);
router.get("/:userId/weeklyProgress/:week",verifyToken,fetchUser, getWeeklyProgress);

module.exports = router;
