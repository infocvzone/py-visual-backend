const Graphics = require("../models/graphicsmodel");
const {
  S3,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const multer = require("multer");
const fs = require("fs").promises;
const path = require("path");

// Configure the S3 client with DigitalOcean Spaces
const s3 = new S3({
  forcePathStyle: false,
  endpoint: "https://blr1.digitaloceanspaces.com", // Spaces endpoint
  region: "blr1",
  credentials: {
    accessKeyId: process.env.DIGITALOCEAN_SPACES_KEY,
    secretAccessKey: process.env.DIGITALOCEAN_SPACES_SECRET,
  },
});

// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/"); // Save files temporarily in "uploads"
    },
    filename: (req, file, cb) => {
      const uniqueName = `${Date.now()}-${file.originalname}`;
      cb(null, uniqueName);
    },
  }),
});

// Middleware for multiple image uploads (expects 'imageFiles' field)
exports.uploadImages = upload.array("imageFiles", 5);

// Middleware for multiple SVG uploads
exports.uploadSVGs = (req, res, next) => {
  const { svgs } = req.body;
  if (!svgs || !Array.isArray(svgs)) {
    return res.status(400).json({ error: "Invalid or missing SVG data." });
  }
  req.svgs = svgs;
  next();
};

exports.createImageGraphics = async (req, res) => {
  const { name, tags } = req.body;

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No image files uploaded." });
  }

  try {
    const uploadedImages = await Promise.all(
      req.files.map(async (file) => {
        const filePath = path.join(__dirname, `../uploads/${file.filename}`);
        const fileKey = `fixedAssets/Graphics/${file.filename}`;

        // Read the uploaded file
        const fileStream = await fs.readFile(filePath);

        // Upload to DigitalOcean Spaces
        const uploadParams = {
          Bucket: "py-visual-spaces",
          Key: fileKey,
          Body: fileStream,
          ACL: "public-read",
          ContentType: file.mimetype,
        };

        await s3.send(new PutObjectCommand(uploadParams));

        // Generate public URL
        const imageUrl = `https://py-visual-spaces.blr1.digitaloceanspaces.com/${fileKey}`;

        // Remove local file after uploading
        await fs.unlink(filePath);

        return {
          name: file.originalname.split(".")[0],
          svg: imageUrl,
          type: "Image",
          tags: Array.isArray(tags)
            ? tags.map((tag) => tag.trim())
            : tags.split("-").map((tag) => tag.trim()),
        };
      })
    );

    // Save metadata to MongoDB
    const newImages = await Graphics.insertMany(uploadedImages);

    res.status(201).json({
      message: "Images uploaded successfully.",
      data: newImages,
    });
  } catch (error) {
    console.error("Error uploading images:", error);
    res.status(500).json({ error: error.message });
  }
};

// Create Button
exports.createSVGGraphics = async (req, res) => {
  try {
    const { svgs } = req.body;

    if (!svgs || svgs.length === 0) {
      return res.status(400).json({ message: "No SVG data provided." });
    }
    const savedSVGs = [];
    for (const svg of svgs) {
      const newSVG = new Graphics({
        name: svg.name,
        svg: svg.svg,
        type: "Svg",
        tags: svg.tags,
      });

      const savedGraphic = await newSVG.save();
      savedSVGs.push(savedGraphic);
    }

    res.status(201).json({
      message: "SVG graphics saved successfully.",
      data: savedSVGs,
    });
  } catch (error) {
    console.error("Error saving SVG graphics:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get Paginated Buttons (with optional tag filtering)
exports.getAllButtons = async (req, res) => {
  try {
    const { page = 0, limit = 30, tag = "" } = req.query;

    console.log(req.query);

    // Convert 'page' to an integer and ensure it's at least 0
    const pageNumber = parseInt(page) >= 0 ? parseInt(page) : 0;
    const pageLimit = parseInt(limit) > 0 ? parseInt(limit) : 30; // Default to 20 shapes per page

    // Build query for the filter (tags)
    const query = tag ? { tags: { $in: [tag] } } : {}; // Match shapes containing the tag in their tags array

    // Fetch shapes with pagination and tag filter if provided
    const shapes = await Graphics.find(query)
      .skip(pageNumber * pageLimit) // Skip shapes based on the page number and limit
      .limit(pageLimit) // Limit results to the specified page limit
      .exec(); // Execute the query

    // Count the total number of matching shapes (for pagination metadata)
    const totalCount = await Graphics.countDocuments(query);

    // Calculate total pages based on total count and page limit
    const totalPages = Math.ceil(totalCount / pageLimit);
    console.log(shapes);
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
