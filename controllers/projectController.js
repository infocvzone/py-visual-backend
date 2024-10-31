// controllers/projectController.js
const Project = require("../models/projectsmodel");

// Create or Update Project
exports.createProject = async (req, res) => {
  const { name, user, color, bgImage, width, height, elements, positions } = req.body;

  try {
    // Check if a project with the same name exists for this user
    const project = await Project.findOneAndUpdate(
      { name, user }, // filter: project with the same name for the specific user
      { name, user, color, bgImage, width, height, elements, positions }, // data to update or insert
      { new: true, upsert: true, setDefaultsOnInsert: true } // options to create if doesn't exist
    );

    res.status(201).json(project);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating or updating project", error });
  }
};

// Get all projects
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate("user", "name email"); // Populating user details
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: "Error fetching projects", error });
  }
};

//Get Project By User Id
exports.getProjectsByUserId = async (req, res) => {
  const userId = req.params.userId; // Assuming userId is passed as a route parameter
  try {
    const projects = await Project.find({ user: userId });
    if (!projects || projects.length === 0) {
      return res
        .status(404)
        .json({ message: "No projects found for this user" });
    }
    res.status(200).json(projects);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching projects for the user", error });
  }
};

// Get project by ID
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate(
      "user",
      "name email"
    );
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: "Error fetching project", error });
  }
};

// Delete project by ID
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting project", error });
  }
};
