const Type = require('../models/typemodel');

// Create
exports.createType = async (req, res) => {
  try {
    const newType = new Type(req.body);
    await newType.save();
    res.status(201).json(newType);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get All
exports.getAllTypes = async (req, res) => {
  try {
    const types = await Type.find();
    res.status(200).json(types);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update
exports.updateType = async (req, res) => {
  try {
    const type = await Type.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!type) return res.status(404).json({ message: 'Type not found' });
    res.status(200).json(type);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete
exports.deleteType = async (req, res) => {
  try {
    await Type.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Type deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
