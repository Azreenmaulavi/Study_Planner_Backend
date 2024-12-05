const User=require("../models/userModel")

exports.fetchUser = async (req, res, next) => {
    // console.log("In fetchUser:", req.user); // Debug: Log req.user
    try {
        const user = await User.findById(req.user.id); // Fetch user based on ID
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        req.user.details = user; // Add user details to req.user
        next();
    } catch (error) {
        console.error("FetchUser Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
