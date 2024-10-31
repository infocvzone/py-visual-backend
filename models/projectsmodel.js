// models/Project.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const ProjectSchema = new Schema({
  name: {
    type: String,
    default: "Project",
  },
  description: {
    type: String,
    default: "",
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User", // Referencing the User model
    required: true,
  },
  color: {
    type: Schema.Types.Mixed,
    default: "#FFFFFF",
  },
  bgImage: {
    type: Schema.Types.Mixed,
    default: "",
  },
  width:{
    type: Number,
    default:700
  },
  height:{
    type: Number,
    default:400
  },
  elements: {
    type: Schema.Types.Mixed, // Allows any data type
  },
  positions: {
    type: Schema.Types.Mixed, // Allows any data type
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Project", ProjectSchema);
