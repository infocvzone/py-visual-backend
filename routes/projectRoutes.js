// routes/projectsRoute.js
const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");

// Route to create a project
router.put("/", projectController.createProject);

// Route to get all projects
router.get("/", projectController.getAllProjects);

// Route to get user projects
router.get("/user/:userId", projectController.getProjectsByUserId);

// Route to get a project by ID
router.get("/:id", projectController.getProjectById);

// Route to delete a project by ID
router.delete("/:id", projectController.deleteProject);

module.exports = router;
