const mongoose = require("mongoose");
const { Schema } = mongoose;

const imagesSchema = new mongoose.Schema(
  {
    type: { type: String, default: "Image" },
    id: { type: Number, default: Date.now() },
    x: { type: Number, default: 100 },
    y: { type: Number, default: 100 },
    url: { type: String, required: true },
    scale_value: { type: Number, default: 1 },
    overlay_color: { type: String, default: "#FFFFFF" },
    hiden: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Pictur = mongoose.model("Pictur", imagesSchema);
module.exports = Pictur;
