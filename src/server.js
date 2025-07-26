const express = require("express");
const mongoose = require("mongoose");
const dotenv =require("dotenv")
const path = require("path"); // ✅ Import path
const studentRoutes = require("./Routes/studentRoutes");
const loginRoutes=require("./Routes/loginRoutes");
const cors = require("cors");

dotenv.config()

const app = express();

app.use(cors({
  origin: "http://localhost:5173", // React app URL
  credentials: true,               // only if you're using cookies
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
