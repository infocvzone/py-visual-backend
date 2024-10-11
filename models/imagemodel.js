const mongoose = require('mongoose');
const { Schema } = mongoose;

const imageSchema = new mongoose.Schema({
  image: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const Image = mongoose.model('Image', imageSchema);
module.exports = Image;
