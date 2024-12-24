// models/persona.model.js
const mongoose = require('mongoose');

const PersonaSchema = new mongoose.Schema({
  persona: {
    type: String,
    required: true,
    default: ""
  },
  id: {
    type: Number,
    required: true,
    default: 1
  }
}, { timestamps: true });

module.exports = mongoose.model('Persona', PersonaSchema);
