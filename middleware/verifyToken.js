const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    // console.log("Auth token",token)

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user; // Attach the user to the request object
        next();
    } catch (error) {
        console.error("JWT Error:", error);  // Log error details
        res.status(400).json({ message: "Invalid or expired token" });
    }
};
