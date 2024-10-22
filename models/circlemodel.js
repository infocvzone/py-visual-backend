const mongoose = require("mongoose");

const circleSchema = new mongoose.Schema(
  {
    id: { type: Number, default: Date.now() },
    type: { type: String, default: "Circle" },
    name: { type: String, default: "Circle" },
    x: { type: Number, default: 100 },
    y: { type: Number, default: 100 },
    radius: { type: Number, default: 30 },
    Color: { type: String, default: "#0f0f0f" },
  },
  { timestamps: true }
);

const Circle = mongoose.model("Circle", circleSchema);
module.exports = Circle;
