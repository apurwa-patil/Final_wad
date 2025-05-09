const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config(); 

const Student = require("./models/student");
const app = express();

app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log(" MongoDB Connected"))
.catch((err) => console.log("Mongo Error:", err));

app.get("/students", async (req, res) => {
  const students = await Student.find();
  res.send(students);
});

app.get("/students/:name", async (req, res) => {
  const { name } = req.params;
  const students = await Student.find({ name });
  res.send(students);
});

app.post("/add-student", async (req, res) => {
  const { name, marks } = req.body;
  const newStudent = new Student({ name, marks });
  await newStudent.save();
  res.send("Student added");
});

app.delete("/delete-student/:name", async (req, res) => {
  const { name } = req.params;
  await Student.findOneAndDelete({ name });
  res.send("Student deleted");
});

app.put("/update", async (req, res) => {
  const { name, marks } = req.body;
  const updated = await Student.findOneAndUpdate(
    { name },
    { $set: { marks } },
    { new: true }
  );
  res.send(updated);
});

app.listen(process.env.PORT, () => {
  console.log(` Server is running on port ${process.env.PORT}`);
});