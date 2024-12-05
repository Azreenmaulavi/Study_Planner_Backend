const Task = require("../models/taskModel");

exports.getWeeklyProgress = async (req, res) => {
    const { userId, week } = req.params;
  
    try {
      // Find all tasks for the user in the specified week
      const tasks = await Task.find({ user: userId, week: week });
  
      if (tasks.length === 0) {
        return res.status(404).json({ error: "No tasks found for this week" });
      }
  
      // Calculate the total target (number of tasks or subtasks) and progress (completed subtasks)
      const totalTarget = tasks.length; 
      console.log("Total target ",totalTarget);
      const totalProgress = tasks.filter(task => task.isCompleted === true).length;
      console.log("Total Progress",totalProgress);
  
      // Calculate progress percentage
      const progress = totalTarget > 0 ? (totalProgress / totalTarget) * 100 : 0;
  
      res.status(200).json({
        success: true,
        progress: progress.toFixed(1),
      });
    } catch (error) {
      console.error("Error fetching weekly progress:", error);
      res.status(500).json({ error: "Error fetching weekly progress", details: error.message });
    }
  };

// Calculate overall progress for a user
exports.getUserProgress = async (req, res) => {
    const { userId } = req.params; // Extract userId and plannerId from the URL parameters
  
    try {
      // Fetch all tasks for the user under the specific planner
      const tasks = await Task.find({ user: userId });
  
      if (tasks.length === 0) {
        return res.status(404).json({ error: "No tasks found for the user" });
      }
  
      // Calculate the number of completed tasks and total tasks
      const completedTasks = tasks.filter(task => task.isCompleted).length;
      const totalTasks = tasks.length;
  
      // Calculate progress percentage
      const progress = (completedTasks / totalTasks) * 100;
  
      // Return the progress of the user
      res.status(200).json({
        success: true,
        progress: progress.toFixed(2), // Return progress as a percentage (two decimal points)
      });
    } catch (error) {
      console.error("Error fetching user progress:", error);
      res.status(500).json({ error: "Error fetching user progress", details: error.message });
    }
  };
  
  // Update progress based on task completion
  exports.updateProgressOnCompletion = async (req, res) => {
    const { taskId } = req.params;
  
    try {
      // Find the task and update its completion status
      const task = await Task.findById(taskId);
      if (!task) return res.status(404).json({ error: "Task not found" });
  
      task.isCompleted = true; // Mark the task as completed
      await task.save(); // Save the task
  
      // Recalculate the user's progress after the update
      const tasks = await Task.find({ planner: task.planner, user: task.user });
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter(t => t.isCompleted).length;
  
      const updatedProgress = (completedTasks / totalTasks) * 100;
  
      // Return the updated progress
      res.status(200).json({
        success: true,
        message: "Task marked as completed",
        updatedProgress: updatedProgress.toFixed(2),
      });
    } catch (error) {
      console.error("Error updating progress:", error);
      res.status(500).json({ error: "Error updating progress", details: error.message });
    }
  };

  // Get tasks with their completion status for the progress tracker
exports.getTasksForProgressTracker = async (req, res) => {
    const { userId } = req.params;
  
    try {
      // Fetch tasks related to the user and planner
      const tasks = await Task.find({ user: userId });
      if (tasks.length === 0) {
        return res.status(404).json({ error: "No tasks found for the user" });
      }
  
      // Map over tasks and return necessary data
      const taskData = tasks.map(task => ({
        taskId: task._id,
        title: task.title,
        isCompleted: task.isCompleted,
        dueDate: task.dueDate,
        progress: task.isCompleted ? 100 : 0, // Set progress based on task completion
      }));
  
      res.status(200).json({
        success: true,
        tasks: taskData,
      });
    } catch (error) {
      console.error("Error fetching tasks for progress tracker:", error);
      res.status(500).json({ error: "Error fetching tasks", details: error.message });
    }
  };
  

  // Reset all tasks to incomplete
exports.resetUserProgress = async (req, res) => {
    const { userId } = req.params;
  
    try {
      // Fetch all tasks for the user in a specific planner
      const tasks = await Task.updateMany(
        { planner: plannerId, user: userId },
        { $set: { isCompleted: false } }
      );
  
      res.status(200).json({
        success: true,
        message: "User progress has been reset.",
      });
    } catch (error) {
      console.error("Error resetting user progress:", error);
      res.status(500).json({ error: "Error resetting progress", details: error.message });
    }
  };
  