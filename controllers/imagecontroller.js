const {
  S3,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const multer = require("multer");
const fs = require("fs").promises;
const path = require("path");
const Image = require("../models/imagemodel");

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
exports.createImage = async (req, res) => {
  const { name } = req.body;

  if (!req.file) {
    return res.status(400).json({ error: "No image file uploaded." });
  }

  const filePath = path.join(__dirname, `../uploads/${req.file.filename}`);
  const fileKey = `fixedAssets/bgImages/${req.file.originalname}`;

  try {
    // Read the uploaded file
    const fileStream = await fs.readFile(filePath);

    const uploadParams = {
      Bucket: "py-visual-spaces",
      Key: fileKey,
      Body: fileStream,
      ACL: "public-read",
      ContentType: req.file.mimetype,
    };

    // Upload image to DigitalOcean Spaces
    await s3.send(new PutObjectCommand(uploadParams));

    const imageUrl = `https://py-visual-spaces.blr1.digitaloceanspaces.com/${fileKey}`;

    // Save image metadata to MongoDB
    const newImage = new Image({ name, url: imageUrl });
    await newImage.save();

    // Remove the local file after uploading
    await fs.unlink(filePath);

    res.status(201).json(newImage);
  } catch (error) {
    await fs.unlink(filePath).catch(() => {}); // Ensure file removal on error
    console.error("Error uploading image:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get All Images Controller
exports.getAllImages = async (req, res) => {
  try {
    const images = await Image.find();
    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Image Controller
exports.deleteImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);

    if (!image) {
      return res.status(404).json({ error: "Image not found." });
    }

    const key = image.url.split(
      "https://py-visual-spaces.blr1.digitaloceanspaces.com/"
    )[1];

    const deleteParams = {
      Bucket: "py-visual-spaces",
      Key: key,
    };

    // Delete image from Spaces
    await s3.send(new DeleteObjectCommand(deleteParams));

    // Delete image from MongoDB
    await Image.findByIdAndDelete(req.params.id);

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
