const mongoose = require("mongoose");

const textSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    type: { type: String, default: "Text" },

    // Positioning
    x: { type: Number, required: true },
    y: { type: Number, required: true },

    // Text content and styling
    text: { type: String, default: "Hello", required: true },
    scale: { type: Number, default: 1.0 },
    fontPath: { type: String, default: null },
    fontSize: { type: Number, default: 20 },
    fontFamily: { type: String, default: "Roboto" },

    // Styling options
    color: { type: String, default: "#000000" },
    bold: { type: Boolean, default: false },
    italic: { type: Boolean, default: false },
    underline: { type: Boolean, default: false },
    strikethrough: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Text = mongoose.model("Text", textSchema);
module.exports = Text;
