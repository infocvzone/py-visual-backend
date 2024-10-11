const Image = require('../models/imagemodel');

// Create Image
exports.createImage = async (req, res) => {
  try {
    const newImage = new Image(req.body);
    await newImage.save();
    res.status(201).json(newImage);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get All Images
exports.getAllImages = async (req, res) => {
  try {
    const images = await Image.find().populate('user');
    res.status(200).json(images);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete Image
exports.deleteImage = async (req, res) => {
  try {
    await Image.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Image deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
