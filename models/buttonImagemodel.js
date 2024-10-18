const mongoose = require("mongoose");

const buttonImageSchema = new mongoose.Schema(
  {
    id: { type: Number, default: Date.now() },
    type: { type: String, default: "ButtonImage" },
    x: { type: Number, default: 150 },
    y: { type: Number, default: 150 },
    idleImage: { type: String, required: true },
    hoverImage: { type: String, required: true },
    clickedImage: { type: String, required: true },
    scale: { type: Number, default: 0.5 },
    text: { type: String, default: "Submit" },
    text_anchor: { type: String, default: "center" },
    textColor: { type: String, default: "#000000" },
    fontFamily: { type: String, default: "Roboto-Bold" },
    fontSize: { type: Number, default: 16 },
    onClick: { type: String, default: null }, // Store function names or references as strings
    onRelease: { type: String, default: null },
    onHover: { type: String, default: null },
    name: { type: String, default: null },
  },
  { timestamps: true }
);

const ButtonImage = mongoose.model("ButtonImage", buttonImageSchema);
module.exports = ButtonImage;
