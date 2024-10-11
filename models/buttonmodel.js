const mongoose = require('mongoose');

const buttonSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  type: { type: String, default: 'BasicButton' },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  width: { type: Number, default: 140 },
  height: { type: Number, default: 50 },
  text: { type: String, default: "CLICK ME" },
  fontFamily: { type: String, default: "Roboto" },
  fontSize: { type: Number, default: 16 },
  textColor: { type: String, default: "#FFFFFF" },
  idleColor: { type: String, default: '#f9b732' },
  hoverColor: { type: String, default: '#ffd278' },
  clickedColor: { type: String, default: '#d1910f' },
  borderColor: { type: String, default: "rgba(0, 0, 0, 0)" },
  borderThickness: { type: Number, default: 0 },
  onClick: { type: String, default: null },  // Store function names or references as strings
  onRelease: { type: String, default: null },
  onHover: { type: String, default: null },
  name: { type: String, default: null }  // Button identifier/name for future usage
}, { timestamps: true });

const Button = mongoose.model('Button', buttonSchema);
module.exports = Button;
