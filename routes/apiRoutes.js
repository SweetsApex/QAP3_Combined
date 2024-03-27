const express = require("express");
const router = express.Router();
const userDAL = require("../DAL/userDAL");

// GET all users
router.get("/users", async (req, res) => {
  try {
    const users = await userDAL.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST a new user
router.post("/users", async (req, res) => {
  console.log(req.body); // Log the incoming request body
  try {
    const newUser = await userDAL.createUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT (replace) an existing user
router.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { username, email, age } = req.body;

  try {
    const updatedUser = await userDAL.updateUser(id, { username, email, age });
    console.log(`User updated: `, updatedUser); // Log the updated user information
    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user: ", error);
    res.status(500).json({ message: error.message });
  }
});

// PATCH (update) an existing user
router.patch("/users/:id", async (req, res) => {
  const { id } = req.params;
  const userData = req.body;

  try {
    const patchedUser = await userDAL.patchUser(id, userData);
    console.log(`User partially updated: `, patchedUser); // Added logging
    res.json(patchedUser);
  } catch (error) {
    console.error("Error partially updating user: ", error); // More descriptive error log
    res.status(500).json({ message: error.message });
  }
});

// DELETE an existing user
router.delete("/users/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Assuming deleteUser is a function that handles the deletion logic
    const deletedUser = await userDAL.deleteUser(id);
    console.log(`Deleted user with ID: ${id}`); // Log the deletion
    res.json({ message: "User successfully deleted.", userId: id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
