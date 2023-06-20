const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  filename: String,
  data: String,
});

module.exports = mongoose.model("Image", ImageSchema);
