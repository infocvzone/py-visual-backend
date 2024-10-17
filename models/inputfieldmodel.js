const mongoose = require("mongoose");

// Define the schema for an input field
const inputFieldSchema = new mongoose.Schema({
  id: {
    type: Number,
    default: Date.now(), // ID of the canvas where the input field is located (optional if you need to track it)
  },
  type: {
    type: String,
    default: "InputField",
  },
  x: {
    type: Number,
    default:150, // The X coordinate of the input field
  },
  y: {
    type: Number,
    default: 150, // The Y coordinate of the input field
  },
  width: {
    type: Number,
    default: 300, // Width of the input field
  },
  height: {
    type: Number,
    default: 40, // Height of the input field
  },
  text: {
    type: String,
    default: "", // The text content entered into the input field
  },
  placeholder: {
    type: String,
    default: "Enter text...", // Placeholder text when the input field is empty
  },
  bgColor: {
    type: String,
    default: "#ffffff", // Background color of the input field
  },
  borderColor: {
    type: String,
    default: "#c8c8c8", // Border color of the input field
  },
  borderThickness: {
    type: Number,
    default: 1, // Thickness of the input field's border
  },
  textColor: {
    type: String,
    default: "#323232", // Color of the text in the input field
  },
  placeholderColor: {
    type: String,
    default: "#c8c8c8", // Color of the placeholder text
  },
  fontSize: {
    type: Number,
    default: 15, // Font size of the input text
  },
  cursorBlinkSpeed: {
    type: Number,
    default: 500, // Speed of cursor blinking in milliseconds
  },
  padding: {
    type: Number,
    default: 10, // Padding inside the input field
  },
  fontFamily: {
    type: String,
    default: "Roboto-Bold", // Font family of the text in the input field
  },
  input_type: {
    type: String,
    default: "text",
  },
  default_text: {
    type: String,
    default: "",
  },
  padding_left: {
    type: Number,
    default: 5,
  },
  padding_right: {
    type: Number,
    default: 5,
  },
  padding_top: {
    type: Number,
    default: 5,
  },
  padding_bottom: {
    type: Number,
    default: 5,
  },
  border_style: {
    type: [String],
    default: ["bottom", "top", "right", "left"],
  },
  on_input: {
    type: String,
    default: null,
  },
});

const InputField = mongoose.model("InputField", inputFieldSchema);

module.exports = InputField;
