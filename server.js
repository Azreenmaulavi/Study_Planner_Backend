const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const plannerRoutes = require("./routes/plannerRoutes");
const taskRoutes = require("./routes/taskRoutes");
const notificationRoutes = require("./routes/notificationsRoute");
const progressRoute = require("./routes/progressRoute");
const path = require('path');

//config dot env
dotenv.config();

//Object
const app = express();
// CORS configuration
const corsOptions = {
  origin: [
    "http://localhost:3000", // Frontend in development
    "https://study-planner-frontend-lsg7ee2sr-practcie.vercel.app" // Frontend in production
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allow these HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allow these headers
  credentials: true, // Allow cookies/auth tokens to be included in requests
};
console.log("Origins",corsOptions)

// Use CORS middleware
app.use(cors(corsOptions)); // Apply CORS options
app.options("*", cors(corsOptions)); // Handle preflight OPTIONS requests globally

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

 

//port
const PORT = 5000 || process.env.PORT;

//database call
connectDB();

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", userRoutes);
app.use("/api", plannerRoutes);
app.use("/api", taskRoutes);
app.use("/api", notificationRoutes);
app.use("/api", progressRoute);
// app.use("/uploads", express.static("uploads"));


//  Available Routes
// app.use("/api", Routes);


// Root Route
app.use("/", (req, res) => {
  res.send("Hello");
});
// Handle invalid routes
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "An internal server error occurred" });
});


//listen server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} `);
});