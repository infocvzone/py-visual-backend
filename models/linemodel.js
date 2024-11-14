const mongoose = require("mongoose");

const lineSchema = new mongoose.Schema(
  {
    id: { type: Number, default: Date.now() },
    type: { type: String, default: "Line" },
    variableName: { type: String, default: "Line" },
    tag: { type: String, default: null },
    name: { type: String, default: "Line" },
    x1: { type: Number, default: 100 },
    y1: { type: Number, default: 100 },
    x2: { type: Number, default: 250 },
    y2: { type: Number, default: 100 },
    Color: { type: String, default: "#0f0f0f" },
    strokeWidth: { type: Number, default: 2 },
  },
  { timestamps: true }
);

const Line = mongoose.model("Line", lineSchema);
module.exports = Line;
