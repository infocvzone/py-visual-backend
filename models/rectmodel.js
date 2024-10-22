const mongoose = require("mongoose");

const RectSchema = new mongoose.Schema(
  {
    id: { type: Number, default: Date.now() },
    type: { type: String, default: "Circle" },
    name: { type: String, default: "Circle" },
    x: { type: Number, default: 100 },
    y: { type: Number, default: 100 },
    Color: { type: String, default: "#0f0f0f" },
    width: { type: Number, default: 100 },
    height: { type: Number, default: 50 },
  },
  { timestamps: true }
);

const Rect = mongoose.model("Rect", RectSchema);
module.exports = Rect;
