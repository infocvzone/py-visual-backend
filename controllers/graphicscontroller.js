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

// Middleware for single image upload (expects 'imageFile' field)
exports.uploadImage = upload.single("imageFile");

// Create Image Controller
exports.createImageGraphics = async (req, res) => {
  const { name, tags, type } = req.body;

  if (!req.file) {
    return res.status(400).json({ error: "No image file uploaded." });
  }

  const filePath = path.join(__dirname, `../uploads/${req.file.filename}`);
  const fileKey = `fixedAssets/Graphics/${req.file.filename}`;

  try {
    // Read the uploaded file
    const fileStream = await fs.readFile(filePath);

    // Upload to DigitalOcean Spaces
    const uploadParams = {
      Bucket: "py-visual-spaces",
      Key: fileKey,
      Body: fileStream,
      ACL: "public-read",
      ContentType: req.file.mimetype,
    };

    await s3.send(new PutObjectCommand(uploadParams));

    const imageUrl = `https://py-visual-spaces.blr1.digitaloceanspaces.com/${fileKey}`;

    // Save metadata to MongoDB
    const newImage = new Graphics({
      name,
      svg: imageUrl,
      type: "Image",
      tags: tags.split("-").map((tag) => tag.trim()),
    });

    await newImage.save();

    // Remove local file after uploading
    await fs.unlink(filePath);

    res.status(201).json({
      message: "Image graphic uploaded successfully.",
      data: newImage,
    });
  } catch (error) {
    await fs.unlink(filePath).catch(() => {});
    console.error("Error uploading image graphic:", error);
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

// Get All Buttons
exports.getAllButtons = async (req, res) => {
    try {
      const buttons = await Graphics.find();
      res.status(200).json(buttons);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
  