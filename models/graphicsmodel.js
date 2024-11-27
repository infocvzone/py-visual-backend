const mongoose = require("mongoose");
const { Schema } = mongoose;

const GraphicsSchema = new mongoose.Schema(
  {
    name: { type: String, default: Date.now },
    svg: { type: String, required: true },
    type: { type: String },
    tags: { type: Array, default: ["icon"] },
  },
  { timestamps: true }
);

const Graphics = mongoose.model("Graphics", GraphicsSchema);
module.exports = Graphics;
