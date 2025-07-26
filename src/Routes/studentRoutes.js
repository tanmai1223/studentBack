const express = require("express");
const routers = express.Router();
const Student = require("../model/student");

// Get all students
routers.get("/", async (req, res) => {
  try {
    const data = await Student.find();
    res.json(data);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Create new student
routers.post("/", async (req, res) => {
  try {
    const data = new Student(req.body);
    await data.save();
    res.status(201).send(data);
  }  catch (err) {
  console.error("Error saving student:", err.message);
  if (err.name === 'ValidationError') {
    console.error("Validation errors:", err.errors);
  }
  res.status(400).send(err.message);
}

});

// Get student by ID
routers.get("/:id", async (req, res) => {
  try {
    const data = await Student.findById(req.params.id);
    if (!data) return res.status(404).json({ message: "Student not found" });
    res.json(data);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Update student by ID
routers.patch("/:id", async (req, res) => {
  try {
    const data = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!data) return res.status(404).json({ message: "Student not found" });
    res.json(data);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Delete student by ID
routers.delete("/:id", async (req, res) => {
  try {
    const data = await Student.findByIdAndDelete(req.params.id);
    if (!data) return res.status(404).json({ message: "Student not found" });
    res.json({ message: "Student deleted successfully", data });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = routers;
