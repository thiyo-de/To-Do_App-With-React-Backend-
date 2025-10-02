const express = require("express");
const router = express.Router();
const Todo = require("../models/Todo");
const auth = require("../middleware/AuthMiddleware"); // Middleware to protect routes

// ---------------- Get all todos ----------------
router.get("/", auth, async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.user.userId });
    res.json(todos);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

// ---------------- Add new todo ----------------
router.post("/", auth, async (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ msg: "Title is required" });

  try {
    const newTodo = new Todo({
      userId: req.user.userId,
      title
    });

    const savedTodo = await newTodo.save();
    res.json(savedTodo);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

// ---------------- Update todo ----------------
router.put("/:id", auth, async (req, res) => {
  const { title, completed } = req.body;

  try {
    const todo = await Todo.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!todo) return res.status(404).json({ msg: "Todo not found" });

    if (title !== undefined) todo.title = title;
    if (completed !== undefined) todo.completed = completed;

    const updatedTodo = await todo.save();
    res.json(updatedTodo);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

// ---------------- Delete todo ----------------
router.delete("/:id", auth, async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!todo) return res.status(404).json({ msg: "Todo not found" });

    res.json({ msg: "Todo deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
