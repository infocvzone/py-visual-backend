const mongoose = require('mongoose');

const fontSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    url: {
        type: String,
        required: true
    }
});

const Font = mongoose.model('Font', fontSchema);
module.exports = Font;
