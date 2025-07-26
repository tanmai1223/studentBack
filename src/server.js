const express = require("express");
const mongoose = require("mongoose");
const dotenv =require("dotenv")
const path = require("path"); // ✅ Import path
const studentRoutes = require("./Routes/studentRoutes");
const loginRoutes=require("./Routes/loginRoutes");
const cors = require("cors");

dotenv.config()

const app = express();

const cors = require('cors');

const allowedOrigins = [
  'https://studentdatabaseproject.netlify.app',
  'https://studentback-ocnq.onrender.com', // <-- add this too
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // if you're using cookies or sessions
}));

app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, "dist"))); // ✅ Your React/Vite build

// MongoDB connection
mongoose
  .connect(process.env.MONGOOSE_CONNECT_URL)
  .then(() => {
    console.log("Connection made successful");
  })
  .catch((err) => {
    console.log(err);
  });

app.use('/',loginRoutes)
// Student API
app.use("/api/student", studentRoutes);

// Serve frontend index.html for all other routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Start server
app.listen(3000, () => {
  console.log("Your app is running on http://localhost:3000");
});
