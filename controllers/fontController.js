require("dotenv").config();
const {
  S3,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const multer = require("multer");
const fs = require("fs").promises;
const path = require("path");
const Font = require("../models/fontModel");

// Configure the S3 client with DigitalOcean Spaces
const s3 = new S3({
  forcePathStyle: false,
  endpoint: "https://blr1.digitaloceanspaces.com", // Spaces endpoint
  region: "blr1",
  credentials: {
    accessKeyId: process.env.DIGITALOCEAN_SPACES_KEY, // Access key
    secretAccessKey: process.env.DIGITALOCEAN_SPACES_SECRET, // Secret key
  },
});

// Configure multer to upload files to the server's "uploads" folder
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/"); // Save files in the "uploads" folder
    },
    filename: (req, file, cb) => {
      const uniqueName = `${Date.now()}-${file.originalname}`;
      cb(null, uniqueName); // Save file with timestamp
    },
  }),
});

// Upload Font Controller
exports.uploadFont = async (req, res) => {
  const fontName = req.body.fontName; // Get font name from request body

  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }

  const filePath = path.join(__dirname, `../uploads/${req.file.filename}`);
  const fileKey = `fixedAssets/fonts/${req.file.originalname}`; // Unique key for Spaces

  try {
    // Upload file to DigitalOcean Spaces
    const fileStream = await fs.readFile(filePath); // Read file from server

    const uploadParams = {
      Bucket: "py-visual-spaces", // Replace with your space name
      Key: fileKey,
      Body: fileStream,
      ACL: "public-read", // Make the file publicly accessible
      ContentType: req.file.mimetype,
    };

    await s3.send(new PutObjectCommand(uploadParams)); // Upload to Spaces

    const fontUrl = `https://py-visual-spaces.blr1.digitaloceanspaces.com/${fileKey}`; // Public URL

    // Save font metadata to MongoDB
    const newFont = new Font({ name: fontName, url: fontUrl });
    await newFont.save();

    // Remove the file from the server after uploading
    await fs.unlink(filePath);

    res.status(201).json(newFont);
  } catch (error) {
    // Ensure the file is unlinked from the server even on error
    await fs.unlink(filePath).catch(() => {});
    console.error("Error uploading font:", error);
    res.status(500).json({ error: error.message });
  }
};

// Middleware to upload file (expects 'fontFile' field)
exports.upload = upload.single("fontFile");

// Get all Fonts Controller
exports.getFonts = async (req, res) => {
  try {
    const fonts = await Font.find();
    res.status(200).json(fonts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Font Controller
exports.deleteFont = async (req, res) => {
  try {
    const font = await Font.findById(req.params.id);

    if (!font) {
      return res.status(404).json({ error: "Font not found." });
    }

    const key = font.url.split(
      "https://py-visual-spaces.blr1.digitaloceanspaces.com/"
    )[1]; // Extract file key from the URL

    const deleteParams = {
      Bucket: "your-space-name", // Replace with your space name
      Key: key,
    };

    await s3.send(new DeleteObjectCommand(deleteParams)); // Delete from Spaces
    await Font.findByIdAndDelete(req.params.id); // Delete from MongoDB

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
