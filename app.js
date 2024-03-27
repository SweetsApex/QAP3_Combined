// Import necessary modules
const express = require("express");

// Create Express app
const app = express();

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
app.set("view engine", "ejs");

// Routes
const apiRoutes = require("./routes/apiRoutes");
app.use("/api", apiRoutes);

// Define route for the root URL ("/")
app.get("/", async (req, res) => {
  try {
    const users = await require("./DAL/userDAL").getAllUsers();
    res.render("index", { users }); // Pass users data to index.ejs
  } catch (error) {
    console.error("Error fetching data from database:", error);
    res.status(500).send("Error fetching data from database");
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
