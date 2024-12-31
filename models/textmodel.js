const mongoose = require("mongoose");

const textSchema = new mongoose.Schema(
  {
    id: { type: Number, default: Date.now() },
    type: { type: String, default: "Text" },
    variableName: { type: String, default: "Text" },
    name: { type: String, default: null },

    // Positioning
    x: { type: Number, default: 150 },
    y: { type: Number, default: 150 },

    // Text content and styling
    text: { type: String, default: "Text" },
    fontSize: { type: Number, default: 20 },
    fontFamily: { type: String, default: "Roboto-Bold" },

    // Styling options
    color: { type: String, default: "#000000" },
    bold: { type: Boolean, default: false },
    italic: { type: Boolean, default: false },
    underline: { type: Boolean, default: false },
    strikethrough: { type: Boolean, default: false },
    bgColor: { type: String, default: "rgba(255,255,255,0)" },
    boxWidth: { type: Number, default: 200 },
    textAlignment: { type: String, default: "left" },
  },
  { timestamps: true }
);

const Text = mongoose.model("Text", textSchema);
module.exports = Text;
