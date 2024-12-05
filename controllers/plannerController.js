// Planner Controller
const Planner = require("../models/plannerModel");

exports.createPlanner = async (req, res) => {
    try {
      console.log("Request User:", req.user); // Debug: Log the user object
      console.log("Request Body:", req.body); // Debug: Log the request body
      const { title, description } = req.body;
  
      // Validate input
      if (!title || !description) {
        return res.status(400).json({ error: "Title and description are required" });
      }
  
      // Create Planner
      const planner = new Planner({
        title,
        description,
        user: req.user.id, // Correctly assign user ID here
      });
  
      await planner.save();
      res.status(201).json(planner);
    } catch (error) {
      console.error("Error Creating Planner:", error); // Log detailed error
      res.status(500).json({ error: "Failed to create planner" });
    }
  };
  
  

exports.updatePlanner = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;
        const planner = await Planner.findByIdAndUpdate(
            id,
            { title, description },
            { new: true }
        );
        if (!planner) {
            return res.status(404).json({ error: 'Planner not found' });
        }
        res.status(200).json(planner);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update planner' });
    }
};

exports.deletePlanner = async (req, res) => {
    try {
        const { id } = req.params;
        const planner = await Planner.findByIdAndDelete(id);
        if (!planner) {
            return res.status(404).json({ error: 'Planner not found' });
        }
        res.status(200).json({ message: 'Planner deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete planner' });
    }
};

exports.getPlanners = async (req, res) => {
    try {
        const planners = await Planner.find({ user: req.user.id });
        // console.log("Planners",planners);
        res.status(200).json(planners);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch planners' });
    }
};

