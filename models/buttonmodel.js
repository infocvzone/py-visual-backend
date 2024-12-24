const mongoose = require("mongoose");

const buttonSchema = new mongoose.Schema(
  {
    id: { type: Number, default: Date.now() },
    type: { type: String, default: "BasicButton" },
    variableName: { type: String, default: "Button" },
    x: { type: Number, default: 150 },
    y: { type: Number, default: 150 },
    width: { type: Number, default: 140 },
    height: { type: Number, default: 50 },
    text: { type: String, default: "CLICK ME" },
    fontFamily: { type: String, default: "Roboto-Bold" },
    fontSize: { type: Number, default: 16 },
    textColor: { type: String, default: "#FFFFFF" },
    idleColor: { type: String, default: "#f9b732" },
    hoverColor: { type: String, default: "#ffd278" },
    clickedColor: { type: String, default: "#d1910f" },
    borderColor: { type: String, default: "#000000" },
    borderThickness: { type: Number, default: 0 },
    opacity: {type: Number , default: 1},
    borderRadius: {type : Number, default: 0},
    onClick: { type: String, default: null }, // Store function names or references as strings
    onRelease: { type: String, default: null },
    onHover: { type: String, default: null },
    name: { type: String, default: null }, // Button identifier/name for future usage
  },
  { timestamps: true }
);

const Button = mongoose.model("Button", buttonSchema);
module.exports = Button;
