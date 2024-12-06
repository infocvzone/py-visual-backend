const Icon = require("../models/iconmodel");

// Create Button
exports.createButton = async (req, res) => {
  try {
    const { svgs } = req.body;

    if (!svgs || svgs.length === 0) {
      return res.status(400).json({ message: "No SVG data provided." });
    }
    const savedIcons = [];
    for (const svgData of svgs) {
      const newIcon = new Icon(svgData);
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

// Get Paginated Buttons (with optional tag filtering)
exports.getAllButtons = async (req, res) => {
  try {
    const { page = 0, limit = 20, tag = "" } = req.query;

    // Convert 'page' to an integer and ensure it's at least 0
    const pageNumber = parseInt(page) >= 0 ? parseInt(page) : 0;
    const pageLimit = parseInt(limit) > 0 ? parseInt(limit) : 20; // Default to 20 shapes per page

    // Build query for the filter (tags)
    const query = tag ? { tags: { $in: [tag] } } : {}; // Match shapes containing the tag in their tags array

    // Fetch shapes with pagination and tag filter if provided
    const shapes = await Icon.find(query)
      .skip(pageNumber * pageLimit) // Skip shapes based on the page number and limit
      .limit(pageLimit) // Limit results to the specified page limit
      .exec(); // Execute the query

    // Count the total number of matching shapes (for pagination metadata)
    const totalCount = await Icon.countDocuments(query);

    // Calculate total pages based on total count and page limit
    const totalPages = Math.ceil(totalCount / pageLimit);

    res.status(200).json({
      data: shapes,
      pagination: {
        currentPage: pageNumber,
        totalPages: totalPages,
        totalCount: totalCount,
        pageLimit: pageLimit,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Button by ID
exports.getButtonById = async (req, res) => {
  try {
    const button = await Icon.findById(req.params.id);
    if (!button) return res.status(404).json({ message: "Button not found" });
    res.status(200).json(button);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update Button
exports.updateButton = async (req, res) => {
  try {
    const button = await Icon.findByIdAndUpdate(req.params.id, req.body, {
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
    await Icon.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Button deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
