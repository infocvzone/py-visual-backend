const mongoose = require("mongoose");
const { Schema } = mongoose;

const imageSchema = new mongoose.Schema(
  {
    name: { type: String, default: Date.now },
    url: { type: String, required: true },
  },
  { timestamps: true }
);

const Image = mongoose.model("Image", imageSchema);
module.exports = Image;
