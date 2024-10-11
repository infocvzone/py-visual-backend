const Text = require('../models/textmodel');

// Create Text
exports.createText = async (req, res) => {
  try {
    const newText = new Text(req.body);
    await newText.save();
    res.status(201).json(newText);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get All Texts
exports.getAllTexts = async (req, res) => {
  try {
    const texts = await Text.find();
    res.status(200).json(texts);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get Text by ID
exports.getTextById = async (req, res) => {
  try {
    const text = await Text.findById(req.params.id);
    if (!text) return res.status(404).json({ message: 'Text not found' });
    res.status(200).json(text);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update Text
exports.updateText = async (req, res) => {
  try {
    const text = await Text.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!text) return res.status(404).json({ message: 'Text not found' });
    res.status(200).json(text);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete Text
exports.deleteText = async (req, res) => {
  try {
    await Text.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Text deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
