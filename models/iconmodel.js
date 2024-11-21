const mongoose = require("mongoose");
const { Schema } = mongoose;

const iconSchema = new mongoose.Schema(
  {
    name: { type: String, default: Date.now },
    svg: { type: String, required: true },
    tags: { type: Array, default: ["icon"] },
  },
  { timestamps: true }
);

const Icon = mongoose.model("Icon", iconSchema);
module.exports = Icon;
