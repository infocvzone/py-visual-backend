const mongoose = require('mongoose');

const buttonImageSchema = new mongoose.Schema({
    id: { type: Number, default: Date.now()},
    type: { type: String, default: 'ButtonImage' },
    x: { type: Number, default: 150 },
    y: { type: Number, default: 150 },
    scale: { type: Number, default: 0.5 },
    text: { type: String, default: "Submit" },
    idleImage: { type: String, required: true },
    hoverImage: { type: String, required: true },
    clickedImage: { type: String, required: true },
    textColor: { type: String, default: '#FFFFFF' },
}, { timestamps: true });

const ButtonImage = mongoose.model('ButtonImage', buttonImageSchema);
module.exports = ButtonImage;
