const mongoose = require("mongoose");
const { Schema } = mongoose;

const ShapesSchema = new mongoose.Schema(
  {
    name: { type: String, default: Date.now },
    svg: { type: String, required: true },
    tags: { type: Array, default: ["Shape"] },
  },
  { timestamps: true }
);

const Shape = mongoose.model("Shape", ShapesSchema);
module.exports = Shape;
