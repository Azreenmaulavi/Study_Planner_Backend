// Task Controller
const Task = require("../models/taskModel");
const moment = require("moment");
const {sendNotifications} =require("../controllers/notificationController")

exports.addTask = async (req, res) => {
  const { title, dueDate } = req.body;

  // Ensure title and dueDate are provided
  if (!title || !dueDate) {
    return res.status(400).json({ error: "Title and due date are required" });
  }

  try {
    // Create a new task and associate it with the planner and user
    const task = await Task.create({
      planner: req.params.plannerId, // Planner ID from URL params
      user: req.user.id,             // User ID from JWT
      title,
      dueDate,
    });

    // Pass userId, title, and message correctly as an object
    await sendNotifications({ 
      userId: req.user.id, 
      title: `New task "${title}"`, 
      message: `A new task "${title}" has been added to your planner.` 
    });

    // Return success with the task details
    res.status(201).json({
      success: true,
      message: "Task added successfully",
      task,
    });
  } catch (error) {
    // Handle errors and send detailed response
    console.error("Error adding task:", error);
    res.status(500).json({ error: "Error adding task" });
  }
};

// Helper function to calculate progress
const calculateProgress = (target, completed) => {
  if (target > 0) {
    return Math.min((completed / target) * 100, 100).toFixed(2);
  }
  return 0;  // If no target, progress is 0%
};
exports.updateTask = async (req, res) => {
  const { title, dueDate,target,completedHours,week } = req.body;
  console.log("TaskId",req.params.id)
  try {
    // Calculate the progress based on target and completed hours
    const progress = calculateProgress(target, completedHours);
     // Check if the progress is 100%, and set isCompleted to true
     const updatedIsCompleted = progress == 100 ? true : false;

    // Find and update the task by ID
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { 
        title, 
        dueDate, 
        isCompleted: updatedIsCompleted,
        target, 
        completedHours, 
        week, 
        progress  // Add calculated progress here
      },
      { new: true }  // Return the updated task
    );

    // Check if task was found and updated
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Return the updated task in the response
    res.status(200).json({ success: true, task });
  } catch (error) {
    // Log the error for debugging
    console.error("Error updating task:", error);

    // Send an error response with the error message
    res.status(500).json({ error: error.message || "Error updating task" });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.status(200).json({ success: true, message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting task" });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      planner: req.params.plannerId,
      user: req.user.id,
    });

    for (let task of tasks) {
      // Check if the week is not set or is 0
      if (task.week === 0 || !task.week) {
        // Calculate the current week of the month based on the due date
        if (task.dueDate) {
          const currentWeekOfMonth = Math.ceil(moment(task.dueDate).date() / 7);

          // Update the week in the database
          await Task.findByIdAndUpdate(task._id, { week: currentWeekOfMonth });
        }
      }
    }

    // Fetch all tasks again after the update
    const updatedTasks = await Task.find({
      planner: req.params.plannerId,
      user: req.user.id,
    });

    // Return the tasks with updated week
    res.status(200).json({ success: true, tasks: updatedTasks });
  } catch (error) {
    console.error(error); // Log error for debugging
    res.status(500).json({ error: "Error fetching tasks" });
  }
};
// Controller to fetch all tasks
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find(); // Fetch all tasks from the database
    return res.status(200).json(tasks); // Respond with the tasks
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
};



// Function to fetch top 3 upcoming tasks sorted by due date for a specific user
// exports.getUpcomingTasks = async (req, res) => {
//   const { userId } = req.params; 
//   console.log("UserId",userId);
//   try {
//     // Fetch the top 3 upcoming tasks for the specified userId
//     const upcomingTasks = await Task.find({
//       user: userId,
//       dueDate: { $gte: new Date() },
//     })
//       .sort({ dueDate: 1 }) // Sort by due date (ascending)
//       .limit(3); // Limit to top 3 tasks

//     console.log("Upcoming Tasks for User ID:", userId, upcomingTasks);

//     if (!upcomingTasks || upcomingTasks.length === 0) {
//       console.error("No upcoming tasks found for user:", userId);
//       return res.status(404).json({
//         success: false,
//         error: `No upcoming tasks found for user ${userId}`,
//       });
//     }

//     // Return the upcoming tasks for the specific user
//     res.status(200).json({
//       success: true,
//       tasks: upcomingTasks,
//     });
//   } catch (error) {
//     // Log the error details to understand the source of the failure
//     console.error("Error fetching upcoming tasks:", error);

//     // Detailed error message with stack trace
//     res.status(500).json({
//       success: false,
//       error: "Error fetching upcoming tasks.",
//       details: error.message, // Provide the specific error message
//       stack: error.stack, // Include the stack trace for debugging
//     });
//   }
// };

exports.getUpcomingTasks = async (req, res) => {
  const { userId } = req.params; 
  console.log("UserId", userId);
  try {
    // Fetch the top 3 upcoming tasks for the specified userId
    const upcomingTasks = await Task.find({
      user: userId, // Change 'userId' to 'user'
      dueDate: { $gte: new Date() },
    })
      .sort({ dueDate: 1 }) // Sort by due date (ascending)
      .limit(3); // Limit to top 3 tasks

    // console.log("Upcoming Tasks for User ID:", userId, upcomingTasks);

    if (!upcomingTasks || upcomingTasks.length === 0) {
      console.error("No upcoming tasks found for user:", userId);
      return res.status(404).json({
        success: false,
        error: `No upcoming tasks found for user ${userId}`,
      });
    }

    // Return the upcoming tasks for the specific user
    res.status(200).json({
      success: true,
      tasks: upcomingTasks,
    });
  } catch (error) {
    // Log the error details to understand the source of the failure
    console.error("Error fetching upcoming tasks:", error);

    // Detailed error message with stack trace
    res.status(500).json({
      success: false,
      error: "Error fetching upcoming tasks.",
      details: error.message, // Provide the specific error message
      stack: error.stack, // Include the stack trace for debugging
    });
  }
};







// exports.getWeeklyProgress = async (req, res) => {
//   const { userId, week } = req.params; // Extract userId and week from the URL params

//   try {
//     // Find all tasks for the user in the specified week
//     const tasks = await Task.find({ user: userId, week: week });

//     if (tasks.length === 0) {
//       return res.status(404).json({ error: "No tasks found for this week" });
//     }

//     // Calculate the total target and total progress
//     const totalTarget = tasks.reduce((acc, task) => acc + task.target, 0);
//     // console.log("Total Target",totalTarget);
//     const totalProgress = tasks.reduce((acc, task) => acc + task.progress, 0);
//     // console.log("Total progress",totalProgress);

//     // Handle case where totalTarget is zero to avoid division by zero
//     let progress = 0;
//     if (totalTarget > 0) {
//       progress = (totalProgress / totalTarget) * 100;
//     //   console.log("Calculation",totalProgress/totalTarget);
//     //   console.log("Progress",progress);
//     }

//     // Return the progress in the response
//     res.status(200).json({
//       success: true,
//       progress: progress.toFixed(1), // Return progress as a percentage
//     });
//   } catch (error) {
//     console.error("Error fetching weekly progress:", error);
//     res.status(500).json({ error: "Error fetching weekly progress", details: error.message });
//   }
// };



