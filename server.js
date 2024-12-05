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
app.use(cors());
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

//listen server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} `);
});