require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db/db");
const userRoutes = require("./routes/userroute");
const adminRoutes = require("./routes/adminroute");
const typeRoutes = require("./routes/typeroute");
const buttonRoutes = require("./routes/buttonroute");
const textRoutes = require("./routes/textroute");
const imageRoutes = require("./routes/imageroute");
const buttonimageRoutes = require("./routes/buttonimageroute");
const inputfieldRoute = require("./routes/inputfieldroute");
const app = express();
const path = require("path");
const upload = require("./utility/uploadImage");
const fs = require("fs");

const PORT = process.env.PORT || 5000;
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb", extended: false }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Routes
app.get('/', (req, res)=>{
  res.json({message: "hello py-visual..."});
});
app.use("/api/users", userRoutes);
app.use("/api/admins", adminRoutes);
app.use("/api/types", typeRoutes);
app.use("/api/buttons", buttonRoutes);
app.use("/api/texts", textRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/buttonImages", buttonimageRoutes);
app.use("/api/inputfields", inputfieldRoute);




/*
//image upload and get routes abc

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }
  res.status(200).send({ filename: req.file.filename });
});


app.get('/api/image', (req, res) => {
  const uploadDir = path.join(__dirname, 'uploads/');

  console.log('Reading directory:', uploadDir); // Debugging the directory

  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      return res.status(500).json({ message: 'Error reading files' });
    }

    console.log('Files found:', files); // Debugging file list

    const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif)$/.test(file.toLowerCase()));
    res.json(imageFiles.map(file => ({
      filename: file,
      url: `http://localhost:3000/uploads/${file}`
    })));
  });
});


// Route to download a specific image
app.get('/api/image/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'uploads', filename);

  res.download(filePath, (err) => {
    if (err) {
      console.error('Error downloading file:', err);
      res.status(404).json({ message: 'File not found' });
    }
  });
});

*/

// Error handling for undefined routes
app.use((req, res, next) => {
  res.status(404).json({ message: "API endpoint not found" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
