const Shape = require("../models/shapesmodel");

// Create Button
exports.createButton = async (req, res) => {
  try {
    const { svgs } = req.body;

    if (!svgs || svgs.length === 0) {
      return res.status(400).json({ message: "No SVG data provided." });
    }
    const savedIcons = [];
    for (const svgData of svgs) {
      const newIcon = new Shape(svgData);
      const savedIcon = await newIcon.save();
      savedIcons.push(savedIcon);
    }
    res.status(201).json({
      message: "All SVGs uploaded successfully.",
      data: savedIcons,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Buttons
exports.getAllButtons = async (req, res) => {
  try {
    const buttons = await Shape.find();
    res.status(200).json(buttons);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get Button by ID
exports.getButtonById = async (req, res) => {
  try {
    const button = await Shape.findById(req.params.id);
    if (!button) return res.status(404).json({ message: "Button not found" });
    res.status(200).json(button);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update Button
exports.updateButton = async (req, res) => {
  try {
    const button = await Shape.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!button) return res.status(404).json({ message: "Button not found" });
    res.status(200).json(button);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete Button
exports.deleteButton = async (req, res) => {
  try {
    await Shape.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Button deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
